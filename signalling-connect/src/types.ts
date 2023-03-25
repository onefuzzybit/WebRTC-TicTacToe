// Since we're passing data between client and server, we need to make sure that the received message
// is indeed based on our infrastructure - just as a sanity precaution. If at some point authentication will be incorporated - this will be removed.
type SIGNAL_MESSAGE_IDENTIFIER_TYPE = '__SIGNALLING__'
export const SIGNAL_MESSAGE_IDENTIFIER: SIGNAL_MESSAGE_IDENTIFIER_TYPE =  '__SIGNALLING__'

export enum SignallingMessages {
	Login='Login',
	Ack='Ack',			// acknowledge message
}

export interface SingallingMessageBase {
	sanity: SIGNAL_MESSAGE_IDENTIFIER_TYPE,
}

export interface LoginMessage extends SingallingMessageBase {
	type: SignallingMessages.Login
	offer: RTCSessionDescriptionInit
}

export interface AckMessage extends SingallingMessageBase {
	type: SignallingMessages.Ack
	ack: SignallingMessages
}

export type SignallingMessage = LoginMessage | AckMessage