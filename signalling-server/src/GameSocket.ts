import { WebSocket } from "ws";

export interface GameSocket extends WebSocket {
	setGameUserId(id: string): void,
	getGameUserId(): string|undefined
}

export class GameSocket extends WebSocket implements GameSocket {
	private gameUserId: string|undefined

	setGameUserId(id: string) {
		this.gameUserId = id
	}

	getGameUserId(): string | undefined {
		return this.gameUserId		
	}

	static FromWebsocket(socket: WebSocket): GameSocket {
		const gameSocket = socket as GameSocket
		gameSocket.setGameUserId = GameSocket.prototype.setGameUserId
		gameSocket.getGameUserId = GameSocket.prototype.getGameUserId
		return gameSocket
	}
}
