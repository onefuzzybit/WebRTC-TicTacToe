
import { createLoginMessage, send, SignallingMessage, SignallingMessages } from 'signalling-connect'
import { ConnectionStatus } from './types'

type SingallingClientConfig = {
	host: string
	port: number
	timeout: number
	onStatusChange: (status: ConnectionStatus) => void
}

//TODO: make this part of the client config.
let rtcConfig = {
	iceServers: [{ urls: 'stun:stun2.1.google.com:19302' }],
}
export function NewSignallingClient(config: SingallingClientConfig) {
	let status = ConnectionStatus.NotConnected
	let socket: WebSocket
	let rtc: RTCPeerConnection

	async function connect() {
		return new Promise((res, rej) => {
			const t = setTimeout(() => {
				status = ConnectionStatus.NotConnected
				rej('Connection timeout')
			}, config.timeout)

			socket = new WebSocket(`ws://${config.host}:${config.port}`)
			socket.onopen = async () => {
				clearTimeout(t)
				onConnect()
				res(null)
			}
		})
	}

	function setStatus(statusIn: ConnectionStatus) {
		status = statusIn
		config.onStatusChange(status)
	}

	function onConnect() {
		setStatus(ConnectionStatus.Connected)
		console.log("Connected to signalling server")

		// handle message whenever one arrives
		socket.onmessage = handleMessage
	}

	async function handleMessage(event: MessageEvent) {
		console.log('Incoming message', event)
		let message: SignallingMessage
		try {
			message = JSON.parse(event.data)
		} catch (err) {
			console.error('Signalling message expected to be a json.', err)
		}
		
		switch (message.type) {
			case SignallingMessages.Ack: if (message.ack === SignallingMessages.Login) setStatus(ConnectionStatus.LoggedIn)
		}
	}

	async function login() {
		if (!socket) await connect()

		rtc = new RTCPeerConnection(rtcConfig)
		const login = createLoginMessage(await rtc.createOffer())
		send(socket, login)
	}

	return {
		connect,
		login,
	}
}

export * from './types'