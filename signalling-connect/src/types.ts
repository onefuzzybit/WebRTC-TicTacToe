// Since we're passing data between client and server, we need to make sure that the received message
// is indeed based on our infrastructure - just as a sanity precaution. If at some point authentication will be incorporated - this will be removed.
type SIGNAL_MESSAGE_IDENTIFIER_TYPE = '__SIGNALLING__'
export const SIGNAL_MESSAGE_IDENTIFIER: SIGNAL_MESSAGE_IDENTIFIER_TYPE = '__SIGNALLING__'

export enum SignallingMessages {
	Login = 'Login',
	Ack = 'Ack', // acknowledge message
	Description = 'Description',
	Candidate = 'Candidate',
	Pairing = 'Pairing',
}

export interface SignallingMessageBase {
	sanity: SIGNAL_MESSAGE_IDENTIFIER_TYPE
	id: string
}

export interface LoginMessage extends SignallingMessageBase {
	type: SignallingMessages.Login
}

export interface AckMessage extends SignallingMessageBase {
	type: SignallingMessages.Ack
	ack: SignallingMessages
}

export interface DescriptionMessage extends SignallingMessageBase {
	description: RTCSessionDescriptionInit
	type: SignallingMessages.Description
}

export interface CandidateMessage extends SignallingMessageBase {
	type: SignallingMessages.Candidate
	candidate: RTCIceCandidate
}

export interface PairingMessage extends SignallingMessageBase {
	type: SignallingMessages.Pairing
	initiator: boolean
	pairId: string
}

export type SignallingMessage = LoginMessage | AckMessage | DescriptionMessage | CandidateMessage | PairingMessage

export interface Sender {
	send(data: string): void
}
