
import { createLoginMessage, OfferMessage, send, SignallingMessage, SignallingMessages, createAnswerMessage, createCandidateMessage, AnswerMessage, CandidateMessage, createOfferMessage } from 'signalling-connect'
import { ConnectionStatus, SignallingClient } from './types'

type SignallingClientConfig = {
	host: string
	port: number
	timeout: number
	onStatusChange: (status: ConnectionStatus) => void
}

//TODO: make this part of the client config.
let rtcConfig = {
	iceServers: [{ url: 'stun:stun2.1.google.com:19302' }],
}
export function NewSignallingClient(config: SignallingClientConfig): SignallingClient {
	let status = ConnectionStatus.NotConnected
	let socket: WebSocket
	let rtc: RTCPeerConnection

	const client: SignallingClient = {
		connect,
		login,
		outgoing: null,
		incoming: null,
	};

	(window as unknown as {sc:SignallingClient}).sc = client

	function setDataChannel(channel: RTCDataChannel, out: boolean) {
		channel.onopen = () => {
			console.log(`Data channel ${channel.label} open`)
			if (out) client.outgoing = channel
			else {
				client.incoming = channel
				setStatus(ConnectionStatus.GameOn)
			}
		}
		channel.onerror = (e) => dcError(channel, e)
		channel.onmessage = (e) => dataMessage(channel, e)
		channel.onclose = (e) => dcClose(channel, e)
	}

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
			case SignallingMessages.Ack: if (message.ack === SignallingMessages.Login) setStatus(ConnectionStatus.LoggedIn); break;
			case SignallingMessages.Offer: return handleOffer(message as OfferMessage)
			case SignallingMessages.Answer: return handleAnswer(message as AnswerMessage)
			case SignallingMessages.Candidate: return handleCandidate(message as CandidateMessage)
		}
	}

	async function login() {
		console.log('login')
		if (!socket) await connect()

		// @ts-ignore
		rtc = new window.webkitRTCPeerConnection(rtcConfig as unknown as RTCConfiguration, { optional: [{ RtpDataChannels: true }] })
		rtc.onicecandidate = onIceCandidate

		// @ts-ignore
		const dataChannel = rtc.createDataChannel(location.search.substring(1), { reliable: true });
		setDataChannel(dataChannel, true)

		rtc.ondatachannel = (e) => {
			console.log(`on data channel ${e.channel.label}`)
			setDataChannel(e.channel, false)
		}

		const offer = await rtc.createOffer()
		rtc.setLocalDescription(offer)
		const login = createLoginMessage(createOfferMessage(offer))
		send(socket, login)
	}

	async function handleOffer(message: OfferMessage) {
		console.log('handle offer')
		rtc.setRemoteDescription(new RTCSessionDescription(message.offer))
		const answer = await rtc.createAnswer()
		rtc.setLocalDescription(answer)
		send(socket, createAnswerMessage(answer))
	}

	async function handleAnswer(message: AnswerMessage) {
		console.log('handle answer')
		rtc.setRemoteDescription(new RTCSessionDescription(message.answer))
	}

	async function handleCandidate(message: CandidateMessage) {
		console.log('handle candidate')
		rtc.addIceCandidate(new RTCIceCandidate(message.candidate))
	}

	function onIceCandidate(e: RTCPeerConnectionIceEvent) {
		console.log('on ice candidate')
		if (e.candidate) send(socket, createCandidateMessage(e.candidate))
	}

	function dcError(channel: RTCDataChannel, e: Event) {
		console.log('data channel error', e)
	}

	function dataMessage(channel: RTCDataChannel, e: Event) {
		console.log(`data channel '${channel.label}' message`, e)
	}

	function dcClose(channel: RTCDataChannel, e: Event) {
		console.log('data channel close', e)
	}

	return client
}

export * from './types'