import {
	CandidateMessage,
	DescriptionMessage,
	SignallingMessage,
	SignallingMessages,
	createCandidateMessage,
	createDescriptionMessage,
	send,
} from '@onefuzzybit/signalling-connect'
import { SignallingSocket } from './signallingSocket'

function log(...args: unknown[]) {
	console.log('[Signalling Client - PeerConnector]', ...args)
}

// implementing perfect negotiation as described in https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
export function NewPeerConnector(
	config: { id: string; pair: string; polite: boolean },
	rtcConfig: RTCConfiguration,
	socket: SignallingSocket,
	onDataChannel: (channel: RTCDataChannel) => void,
) {
	log('Inititing NewPeerConnector. Config:', config)

	let makingOffer = false
	let ignoreOffer = false

	const pc = new RTCPeerConnection(rtcConfig)

	pc.onnegotiationneeded = async () => {
		try {
			makingOffer = true
			await pc.setLocalDescription()
			send(socket, createDescriptionMessage(pc.localDescription))
		} catch (err) {
			console.error(err)
		} finally {
			makingOffer = false
		}
	}

	pc.onicecandidate = ({ candidate }) => send(socket, createCandidateMessage(candidate))

	pc.oniceconnectionstatechange = () => {
		if (pc.iceConnectionState === 'failed') {
			pc.restartIce()
		}
	}

	// the impolite peer starts the data channel.
	if (!config.polite) {
		onDataChannel(pc.createDataChannel('MyApp Channel'))
	} else {
		pc.ondatachannel = (event: RTCDataChannelEvent) => {
			onDataChannel(event.channel)
		}
	}

	async function handleDescription(message: DescriptionMessage) {
		try {
			const offerCollision = message.description.type === 'offer' && (makingOffer || pc.signalingState !== 'stable')

			ignoreOffer = !config.polite && offerCollision
			if (ignoreOffer) {
				return
			}

			await pc.setRemoteDescription(message.description)
			if (message.description.type === 'offer') {
				await pc.setLocalDescription()
				send(socket, createDescriptionMessage(pc.localDescription))
			}
		} catch (err) {
			log('### ERROR ###', 'processing handleDescription', err)
			throw err
		}
	}

	async function handleCandidate(message: CandidateMessage) {
		try {
			await pc.addIceCandidate(message.candidate)
		} catch (err) {
			if (!ignoreOffer) {
				log('### ERROR ###', 'in handleCandidate', err)
				throw err
			}
		}
	}

	async function onMessage(message: SignallingMessage) {
		switch (message.type) {
			case SignallingMessages.Description:
				return handleDescription(message)
			case SignallingMessages.Candidate:
				return handleCandidate(message)
			default:
				log('### ERROR ###', 'Unexpected message received', message)
		}
	}

	return {
		onMessage,
	}
}

export type PeerConnector = ReturnType<typeof NewPeerConnector>
