import { Server, WebSocket, RawData} from 'ws'
import { IncomingMessage } from 'http'
import { createAckMessage, send, SignallingMessages } from 'signalling-connect'

function main() {
	const port = 9090
	const websocketServer = new Server({port}); 
	websocketServer.on('connection', handleConnection)
	console.log(`Webserver waiting for connections on port ${port}...`)
}

main()

function handleConnection(conn: WebSocket, message: IncomingMessage) {
	console.log('Client connected', message.socket.remoteAddress)
	conn.on('message', (data, binary) => handleMessage(conn, data, binary))
}

function handleMessage(conn: WebSocket, dataIn: RawData, _binary: boolean) {
	let message; 
	//accepting only JSON messages 
	try {
	   message = JSON.parse(dataIn.toString()); 
	} catch (e) { 
	   console.error(`Error! Expected JSON input. Aborting message handling: '${dataIn}'`); 
	   message = {};
	}

	console.log('Got message. Data: ', message)
	switch (message.type) {
		case SignallingMessages.Login: send(conn, createAckMessage(SignallingMessages.Login)) 		
	}
}
