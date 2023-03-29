export enum ConnectionStatus {
	NotConnected,
	Connected,
	LoggedIn,
	GameOn,
}

export type SignallingClient = {
	connect: VoidFunction,
	login(): Promise<void>,
	outgoing: RTCDataChannel|null
	incoming: RTCDataChannel|null
}