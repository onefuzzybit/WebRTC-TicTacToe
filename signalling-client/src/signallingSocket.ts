import { SignallingMessage, SignallingMessages, createLoginMessage, send } from '@onefuzzybit/signalling-connect'
import { ConnectionStatus, ConnectionStatusListener, SignallingClientConfig } from './types'

export function NewSignallingSocket(config: SignallingClientConfig, onMessage: (event: SignallingMessage) => void) {
	let socket: WebSocket
	let status = ConnectionStatus.NotConnected
	const connectionStatusListeners: ConnectionStatusListener[] = []

	function log(...args: unknown[]) {
		console.log('[Signalling client - socket]', ...args)
	}

	async function connect() {
		return new Promise((res, rej) => {
			const t = setTimeout(() => {
				status = ConnectionStatus.NotConnected
				rej('Connection timeout')
			}, config.timeout)

			socket = new WebSocket(`${config.ssl ? 'wss://' : 'ws://'}${config.host}:${config.port}/ws`)
			socket.onopen = async () => {
				clearTimeout(t)
				onConnect()
				res(null)
			}
		})
	}

	function onConnect() {
		setStatus(ConnectionStatus.Connected)
		log('Connected to signalling server')

		// handle message whenever one arrives
		socket.onmessage = (event: MessageEvent) => {
			log('Incoming message', event)
			let message: SignallingMessage
			try {
				message = JSON.parse(event.data)
			} catch (err) {
				console.error('Signalling message expected to be a json.', err)
				return
			}

			if (message.type === SignallingMessages.Ack) {
				if (message.ack === SignallingMessages.Login) setStatus(ConnectionStatus.LoggedIn)
				return
			}

			onMessage(message)
		}
	}

	async function login() {
		log('login')
		if (!socket) await connect()

		const login = createLoginMessage()
		send(socket, login)
		return login.id
	}

	function setStatus(statusIn: ConnectionStatus) {
		status = statusIn
		connectionStatusListeners.forEach((l) => l(status))
	}

	function addConnectionStatusListener(listener: ConnectionStatusListener) {
		if (connectionStatusListeners.includes(listener)) {
			console.error('Cannot register the same listener twice.')
			return
		}
		connectionStatusListeners.push(listener)
	}

	function removeConnectionStatusListener(listener: ConnectionStatusListener) {
		const index = connectionStatusListeners.indexOf(listener)
		if (index === -1) {
			console.debug('Requested to remove connection listener that is not registered')
		}
		connectionStatusListeners.splice(index, 1)
	}

	return {
		connect,
		login,
		addConnectionStatusListener,
		removeConnectionStatusListener,
		send: (data: string) => socket?.send(data),
		setConnectionStatus: setStatus,
	}
}

export type SignallingSocket = ReturnType<typeof NewSignallingSocket>
