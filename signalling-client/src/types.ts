export enum ConnectionStatus {
	NotConnected,
	Connected,
	LoggedIn,
	DataChannelOpen,
}

export type SignallingClient = {
	connect: VoidFunction
	login(): Promise<void>
	sendMessage(message: string): void
	addMessageListener: (listener: MessageEventListener) => void
	removeMessageListener: (listener: MessageEventListener) => void
	isInitiator: () => boolean
	addConnectionStatusListener: (listener: ConnectionStatusListener) => void
	removeConnectionStatusListener: (listener: ConnectionStatusListener) => void
}

export type SignallingClientConfig = {
	host: string
	port: number
	timeout: number
	rtcConfig: RTCConfiguration
	ssl: boolean
}

export type ConnectionStatusListener = (status: ConnectionStatus) => void
export type MessageEventListener = (event: MessageEvent) => void
