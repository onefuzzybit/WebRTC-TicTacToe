import { AckMessage, AnswerMessage, CandidateMessage, LoginMessage, OfferMessage, SignallingMessage, SignallingMessages, SIGNAL_MESSAGE_IDENTIFIER } from "./types";
import { nanoid } from 'nanoid'

// start by setting up a local id.
let uuid: string

function baseMessage() {
	if (!uuid) uuid = nanoid()
	return { sanity: SIGNAL_MESSAGE_IDENTIFIER, id: uuid }
}

export function validate(message: SignallingMessage) {
	if (typeof message !== 'object' || message.sanity !== SIGNAL_MESSAGE_IDENTIFIER) {
		const print = typeof message === 'object' ? JSON.stringify(message) : message
		throw new Error(`Message is not a valid signalling message! ${print}`)
	}
}

export function createLoginMessage(offer: OfferMessage): LoginMessage {
	return { type: SignallingMessages.Login, ...baseMessage(), offer }	
}

export function createOfferMessage(offer: RTCSessionDescriptionInit): OfferMessage {
	return { type: SignallingMessages.Offer, ...baseMessage(), offer }
}

export function createAnswerMessage(answer: RTCSessionDescriptionInit): AnswerMessage {
	return { type: SignallingMessages.Answer, ...baseMessage(), answer }
} 

export function createCandidateMessage(candidate: RTCIceCandidate): CandidateMessage {
	return { type: SignallingMessages.Candidate, ...baseMessage(), candidate }
}

export function createAckMessage(ack: SignallingMessages): AckMessage {
	return { type: SignallingMessages.Ack, sanity: SIGNAL_MESSAGE_IDENTIFIER ,ack, id: 'server' }
}

export function send(socket: WebSocket, message: SignallingMessage) {
	validate(message)
	socket.send(JSON.stringify(message))
}

export * from './types'
