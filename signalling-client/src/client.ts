import { SignallingMessage, SignallingMessages, PairingMessage } from '@onefuzzybit/signalling-connect'
import { ConnectionStatus, MessageEventListener, SignallingClient, SignallingClientConfig } from './types'
import { NewSignallingSocket } from './signallingSocket'
import { NewPeerConnector, PeerConnector } from './peerConnector'

function log(...args: unknown[]) {
	console.log('[Signalling Client]', ...args)
}

export function NewSignallingClient(config: SignallingClientConfig): SignallingClient {
	let rtc: PeerConnector
	let id: string
	let initiator = false
	let dataChannel: RTCDataChannel | null = null
	const eventListeners: MessageEventListener[] = []

	const socket = NewSignallingSocket(config, handleMessage)

	const client: SignallingClient = {
		connect: socket.connect,
		addConnectionStatusListener: socket.addConnectionStatusListener,
		removeConnectionStatusListener: socket.removeConnectionStatusListener,
		login: async () => {
			id = await socket.login()
		},
		sendMessage,
		addMessageListener,
		removeMessageListener,
		isInitiator: () => initiator,
	}

	function sendMessage(message: string) {
		dataChannel.send(message)
	}

	function addMessageListener(f: MessageEventListener) {
		eventListeners.push(f)
	}

	function removeMessageListener(f: MessageEventListener) {
		const index = eventListeners.indexOf(f)
		if (index > -1) eventListeners.splice(index, 1)
	}

	function onRtcMessage(event: MessageEvent) {
		eventListeners.forEach((l) => l(event))
	}

	// TODO: this is only for debugging. use env variables.
	;(window as unknown as { sc: SignallingClient }).sc = client

	function setDataChannel(channel: RTCDataChannel) {
		channel.onopen = () => {
			log(`Data channel ${channel.label} open`)
			dataChannel = channel
			dataChannel.addEventListener('message', onRtcMessage)
			socket.setConnectionStatus(ConnectionStatus.DataChannelOpen)
		}
		channel.onerror = (e) => dcError(channel, e)
		channel.onmessage = (e) => dataMessage(channel, e)
		channel.onclose = (e) => dcClose(channel, e)
	}

	async function handleMessage(message: SignallingMessage) {
		if (message.type === SignallingMessages.Pairing) return setInitiator(message)

		if (rtc) return rtc.onMessage(message)

		log('### ERROR ###', 'Received unexpected message that cannot be processed', message)
	}

	function setInitiator(message: PairingMessage) {
		// initiator can be used by the calling application for easier sync
		initiator = message.initiator

		// the initiator is not the polite node.
		rtc = NewPeerConnector({ id, pair: message.pairId, polite: !message.initiator }, config.rtcConfig, socket, setDataChannel)
	}

	function dcError(channel: RTCDataChannel, e: Event) {
		log('data channel error', e)
	}

	function dataMessage(channel: RTCDataChannel, e: Event) {
		log(`data channel '${channel.label}' message`, e)
	}

	function dcClose(channel: RTCDataChannel, e: Event) {
		log('data channel close', e)
	}

	return client
}

export * from './types'
