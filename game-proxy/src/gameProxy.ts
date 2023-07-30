import { GameConfig, GameTypeClass, GameTypeProxyConstructor, Player } from './gameProxy.types'
import { ConnectionStatus, NewSignallingClient, SignallingClient } from 'signalling-client'
import { useEffect, useRef, useState } from 'react'

type GameEventListener = (data: Record<string, unknown>) => void

export class GameProxy<P extends Player, U, S, W, M, E> {
	private signalingClient: SignallingClient
	private listeners: Record<string, GameEventListener[]> = {}
	private gameListeners: Record<string, GameEventListener[]> = {}

	constructor(gameConfig: GameConfig<P, U, S, W, M, E>, setState: (state: S) => void) {
		this.signalingClient = NewSignallingClient(gameConfig.connectionConfig)
		this.signalingClient.addConnectionStatusListener((status) => {
			status === ConnectionStatus.LoggedIn && this.dispatchGameEvent('logged-in')
			status === ConnectionStatus.DataChannelOpen && this.dispatchGameEvent('starting-game')
			if (gameConfig.state.connectionStatusStateMap?.[status]) {
				setState(gameConfig.state.connectionStatusStateMap[status])
			}
		})

		this.signalingClient.addMessageListener(this.onMessage.bind(this))
	}

	connect() {
		this.signalingClient.login()
	}

	send(event: string, details: Record<string, unknown>) {
		// TODO: update this to support broadcast.
		this.signalingClient.sendMessage(JSON.stringify({ type: event, details }))
	}

	onMessage(event: MessageEvent) {
		try {
			const eventData: Record<string, unknown> = JSON.parse(event.data)
			if (!eventData.type) throw new Error('Invalid event. missing event type')
			if (!this.listeners[eventData.type as string]) {
				console.debug('No listeners registered for event', eventData.type, event)
				return
			}
			// run all listeners
			this.listeners[eventData.type as string].forEach((l) => l(eventData.details as Record<string, unknown>))
		} catch (err) {
			console.error('Cannot process event', event, err)
		}
	}

	private addListener(type: string, listenerType: 'event' | 'game', listener: GameEventListener) {
		if (!['event', 'game'].includes(listenerType)) {
			throw new Error(`Invalid listener type '${listenerType}'. Valid values are 'event' and 'game'`)
		}
		const map = listenerType === 'event' ? this.listeners : this.gameListeners
		if (!map[type]) map[type] = []
		map[type].push(listener)
	}

	private removeListener(type: string, listenerType: 'event' | 'game', listener: GameEventListener) {
		if (!['event', 'game'].includes(listenerType)) {
			throw new Error(`Invalid listener type '${listenerType}'. Valid values are 'event' and 'game'`)
		}
		const map = listenerType === 'event' ? this.listeners : this.gameListeners

		if (!map[type]) {
			console.debug(`Request to remove ${listenerType} listener ignored - no listeners registered for specified type`, type)
			return
		}
		const index = map[type].indexOf(listener)
		if (index === -1) {
			console.debug(`Request to remove ${listenerType} listener ignored - listener not found in listener list`)
		}
		map[type].splice(index, 1)
	}

	addEventListener(type: string, listener: GameEventListener) {
		this.addListener(type, 'event', listener)
	}
	removeEventListener(type: string, listener: GameEventListener) {
		this.removeListener(type, 'event', listener)
	}

	addGameListener(type: string, listener: GameEventListener) {
		this.addListener(type, 'game', listener)
	}
	removeGameListener(type: string, listener: GameEventListener) {
		this.removeListener(type, 'game', listener)
	}

	dispatchGameEvent(type: string, data?: Record<string, unknown>) {
		if (!this.gameListeners[type]) {
			console.debug('No game listeners registered for event', type, data)
			return
		}

		try {
			// run all listeners
			this.gameListeners[type].forEach((l) => l(data))
		} catch (err) {
			console.error('cannot process game event', type, data, err)
		}
	}

	isInitiator() {
		return this.signalingClient.isInitiator()
	}
}

export function useGameProxy<P extends Player, U, S, W, M, E, X extends GameTypeClass<P, S, W, M>>(
	proxy: GameTypeProxyConstructor<P, U, S, W, M, E, X>,
	gameConfig: GameConfig<P, U, S, W, M, E>,
): { game: X; update: number } {
	const [game, setGame] = useState<X>()
	const updateRef = useRef(0)
	const [update, setUpdate] = useState(0)

	useEffect(() => {
		if (game) return
		setGame(new proxy(gameConfig, () => setUpdate(++updateRef.current)))
	}, [gameConfig])

	return {
		game,
		update,
	}
}
