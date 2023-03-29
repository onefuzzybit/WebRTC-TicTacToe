import { Server, WebSocket, RawData} from 'ws'
import { IncomingMessage } from 'http'
import { createAckMessage, LoginMessage, send, SignallingMessages, validate, AnswerMessage, CandidateMessage, OfferMessage } from 'signalling-connect'
import { GameSocket } from './GameSocket'

type UserData = { offer: OfferMessage, socket: GameSocket, match?: string }
type Users = { [id: string]: UserData }

const users: Users = {}
const pendingUsers: string[] = []

function main() {
	const port = 9090
	const websocketServer = new Server({port}); 
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

	// User has abandoned. remove its match.
	const match = users[user].match 
	if (match) delete users[match].match 

	// remove the user
	delete users[user]

	// remove from pending
	const index = pendingUsers.indexOf(user)
	index > -1 && pendingUsers.splice(index, 1)
}

function handleMessage(conn: GameSocket, dataIn: RawData, _binary: boolean) {
	let message; 
	//accepting only JSON messages 
	try {
	   message = JSON.parse(dataIn.toString());

	   // input check
	   validate(message)
	} catch (e) { 
	   console.error(`Error! Expected JSON input. Aborting message handling: '${dataIn}'`, e); 
	   message = {};
	}

	console.log('Got message. Data: ', message)
	
	// run handler
	switch (message.type) {
		case SignallingMessages.Login: handleLogin(conn, message); break;
		case SignallingMessages.Answer: handleAnswer(conn, message); break;
		case SignallingMessages.Candidate: handleCandidate(conn, message); break;
	}

	// send ack for message received
	send(conn, createAckMessage(message.type))
}

function handleLogin(conn: GameSocket, message: LoginMessage) {
	// if already logged in - do nothing
	if (users[message.id]) return

	// set connection user
	conn.setGameUserId(message.id)

	// register user to users list
	users[message.id] = { socket: conn, offer: message.offer }

	// if there are no pending users - register as pending
	if (!pendingUsers.length) {
		pendingUsers.push(message.id)
		return
	}

	// if we got here, there's a pending user. let's start the handshake by sending an offer
	const match = pendingUsers.shift() as string
	users[match].match = message.id
	users[message.id].match = match
	send(conn, users[match].offer)
}

function handleAnswer(conn: WebSocket, message: AnswerMessage) {
	const match = users[message.id].match
	if (!match) return
	send(users[match].socket, message)
}

function handleCandidate(conn: WebSocket, message: CandidateMessage) {
	const match = users[message.id].match
	if (!match) return
	send(users[match].socket, message)
}

