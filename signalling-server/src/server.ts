import { Server, WebSocket, RawData } from 'ws'
import { IncomingMessage } from 'http'
import {
	createAckMessage,
	LoginMessage,
	send,
	SignallingMessages,
	validate,
	setId,
	createPairingMessage,
	DescriptionMessage,
	CandidateMessage,
} from '@onefuzzybit/signalling-connect'
import { GameSocket } from './GameSocket'

type PairingData = { initiator: string; pair: string; offer?: DescriptionMessage }
type UserData = { socket: GameSocket; pairing?: PairingData }
type Users = { [id: string]: UserData }

const users: Users = {}
const pendingUsers: string[] = []

function main() {
	setId('server')
	const port = 9090
	const websocketServer = new Server({ port })
	websocketServer.on('connection', handleConnection)
	console.log(`Webserver waiting for connections on port ${port}...`)
}

main()

function handleConnection(conn: WebSocket, message: IncomingMessage) {
	const gameConn = GameSocket.FromWebsocket(conn)
	console.log('Client connected', message.socket.remoteAddress)
	conn.on('message', (data, binary) => handleMessage(gameConn, data, binary))
	conn.on('close', () => handleClose(gameConn))
}

function handleClose(conn: GameSocket) {
	console.log('Connection closed')
	const user = conn.getGameUserId()
	if (!user) return

	console.log(`Scratching user ${user}`)

	// User has abandoned. remove its match if exists.
	const pairing = users[user].pairing
	if (pairing) {
		const match = pairing.initiator === conn.getGameUserId() ? pairing.pair : pairing.initiator
		if (match) delete users[match].pairing
	}

	// remove the user
	delete users[user]

	// remove from pending
	const index = pendingUsers.indexOf(user)
	index > -1 && pendingUsers.splice(index, 1)
}

function handleMessage(conn: GameSocket, dataIn: RawData, _binary: boolean) {
	let message
	//accepting only JSON messages
	try {
		message = JSON.parse(dataIn.toString())

		// input check
		validate(message)
	} catch (e) {
		console.error(`Error! Expected JSON input. Aborting message handling: '${dataIn}'`, e)
		message = {}
	}

	console.log('Got message. Data: ', message)

	// run handler
	switch (message.type) {
		case SignallingMessages.Login:
			handleLogin(conn, message)
			break
		case SignallingMessages.Description:
		case SignallingMessages.Candidate:
			handleNegotiationMessage(conn, message)
			break
	}

	// send ack for message received
	send(conn, createAckMessage(message.type))
}

function handleLogin(conn: GameSocket, message: LoginMessage) {
	// set connection user
	conn.setGameUserId(message.id)

	// if already logged in - do nothing
	if (users[message.id]) return

	// register user to users list
	users[message.id] = { socket: conn }
	const newUser = users[message.id]

	// if there are no pending users - register as pending
	if (!pendingUsers.length) {
		pendingUsers.push(message.id)
		return
	}

	// if we got here, there's a pending user.
	const firstUserId = pendingUsers.shift() as string
	const firstUser = users[firstUserId]

	const pairing: PairingData = { initiator: firstUserId, pair: message.id }
	firstUser.pairing = pairing
	newUser.pairing = pairing

	// the first user will be the initiator
	send(firstUser.socket, createPairingMessage(message.id, true))

	// The new user get's a pairing message as well.
	send(conn, createPairingMessage(firstUserId, false))
}

function handleNegotiationMessage(conn: WebSocket, message: DescriptionMessage | CandidateMessage) {
	const pairing = users[message.id].pairing
	if (!pairing) return

	const match = pairing.initiator === message.id ? pairing.pair : pairing.initiator
	if (!match) return
	send(users[match].socket, message)
}

// required in order to make sure the process exists when there's a change to the code in dev mode (nodemon)
process.on('SIGINT', () => {
	process.exit()
})
