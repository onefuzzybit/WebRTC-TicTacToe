import { AckMessage, LoginMessage, SignallingMessage, SignallingMessages, SIGNAL_MESSAGE_IDENTIFIER } from "./types";

export function getType(message: SignallingMessage) {
	if (typeof message !== 'object' || message.sanity !== SIGNAL_MESSAGE_IDENTIFIER) {
		const print = typeof message === 'object' ? JSON.stringify(message) : message
		throw new Error(`Message is not a valid signalling message! ${print}`)
	}
	return message.type
}

function sanity() {
	return { sanity: SIGNAL_MESSAGE_IDENTIFIER }
}
function validate(message: SignallingMessage) {
	getType(message)
}

export function createLoginMessage(offer: RTCSessionDescriptionInit): LoginMessage {
	return {
		offer,
		type: SignallingMessages.Login,
		...sanity(),
	}	
}

export function createAckMessage(ack: SignallingMessages): AckMessage {
	return {
		...sanity(),
		type: SignallingMessages.Ack,
		ack,
	}
}

export function send(socket: WebSocket, message: SignallingMessage) {
	validate(message)
	socket.send(JSON.stringify(message))
}

export * from './types'
