import {
	AckMessage,
	CandidateMessage,
	LoginMessage,
	DescriptionMessage as DescriptionMessage,
	SignallingMessage,
	SignallingMessages,
	SIGNAL_MESSAGE_IDENTIFIER,
	Sender,
	PairingMessage,
} from './types'
import { nanoid } from 'nanoid'

// start by setting up a local id.
let uuid: string

function baseMessage() {
	if (!uuid) uuid = nanoid()
	return { sanity: SIGNAL_MESSAGE_IDENTIFIER, id: uuid }
}

export function setId(id: string) {
	uuid = id
}

export function validate(message: SignallingMessage) {
	if (typeof message !== 'object' || message.sanity !== SIGNAL_MESSAGE_IDENTIFIER) {
		const print = typeof message === 'object' ? JSON.stringify(message) : message
		throw new Error(`Message is not a valid signalling message! ${print}`)
	}
}

export function createLoginMessage(): LoginMessage {
	return { type: SignallingMessages.Login, ...baseMessage() }
}

export function createDescriptionMessage(description: RTCSessionDescriptionInit): DescriptionMessage {
	return { type: SignallingMessages.Description, ...baseMessage(), description }
}

export function createCandidateMessage(candidate: RTCIceCandidate): CandidateMessage {
	return { type: SignallingMessages.Candidate, ...baseMessage(), candidate }
}

export function createAckMessage(ack: SignallingMessages): AckMessage {
	return { type: SignallingMessages.Ack, sanity: SIGNAL_MESSAGE_IDENTIFIER, ack, id: 'server' }
}

export function createPairingMessage(pairId: string, initiator: boolean): PairingMessage {
	return { type: SignallingMessages.Pairing, ...baseMessage(), initiator, pairId }
}

export function send(socket: Sender, message: SignallingMessage) {
	validate(message)
	socket.send(JSON.stringify(message))
}

export * from './types'
