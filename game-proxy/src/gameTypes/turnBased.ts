import { GameProxy } from '../gameProxy'
import { Player } from '../gameProxy.types'
import { TurnBasedGameRuntime, TurnBasedConfig, TurnBasedGameType, TurnBasedConfigExState } from './turnBased.types'
import { isEqual } from 'lodash'

export class TurnBased<P extends Player, U, S, W, M> implements TurnBasedGameType<P, S, W, M> {
	private gameProxy: GameProxy<P, U, S, W, M, TurnBasedConfigExState<P>>
	private gameConfig: TurnBasedConfig<P, U, S, W, M>
	private gameRuntime: TurnBasedGameRuntime<W, S, P>
	private gameUpdate: VoidFunction

	constructor(gameConfig: TurnBasedConfig<P, U, S, W, M>, gameUpdate: VoidFunction) {
		this.gameConfig = gameConfig
		this.gameRuntime = {
			world: gameConfig.initWorldState,
			turn: gameConfig.exState.starting || gameConfig.players.names[0],
			state: undefined,
		}
		this.gameProxy = new GameProxy(gameConfig, (s) => {
			this.gameRuntime.state = s
			gameUpdate()
		})

		this.gameUpdate = gameUpdate
		this.gameProxy.addGameListener('starting-game', this.onGameStarting.bind(this))
		this.gameProxy.connect()
	}

	onGameStarting() {
		this.gameProxy.addEventListener('negotiateStartingPlayer', this.onNegotiateStartingPlayer)
		this.gameProxy.addEventListener('remoteTurn', this.onRemoteTurn)

		// Implementation of the 'onConnected' event.
		// This can include logic specific to the TurnBased game type,
		// such as randomizing the starting player if it's not provided in the configuration.
		if (this.gameConfig.exState.starting === undefined) {
			if (this.gameProxy.isInitiator()) {
				// TODO: This is written as if it would work generically, but in fact it doesn't support the actual players
				// count. For now - since i only support a 2 player game - this is good enough.
				const randomPlayerIndex = Math.floor(Math.random() * this.gameConfig.players.names.length)
				const startingPlayer = this.gameConfig.players.names[randomPlayerIndex]
				this.gameProxy.send('negotiateStartingPlayer', { startingPlayer })
				this.gameRuntime.state = this.gameConfig.state.firstGameState
				this.gameRuntime.turn = startingPlayer
				this.gameConfig.exState.starting = startingPlayer
				this.gameUpdate()
			}
		}

		// initiator player the first player
		this.gameConfig.exState.me = this.gameProxy.isInitiator()
			? this.gameConfig.players.names[0]
			: this.gameConfig.players.names[1]
	}

	onNegotiateStartingPlayer = (data: { startingPlayer: P }) => {
		this.gameConfig.exState.starting = data.startingPlayer
		this.gameProxy.removeEventListener('negotiateStartingPlayer', this.onNegotiateStartingPlayer)
		this.gameRuntime.state = this.gameConfig.state.firstGameState
		this.gameRuntime.turn = data.startingPlayer
		this.gameUpdate()
	}

	onRemoteTurn = (data: { world: W; state: S; move: M; player: P }) => {
		// TODO: Currently, there is no checking that we are actually waiting for another's turn at the moment.
		// it allows remote users to fake send moves and in some cases it would cause the current turn to be skipped.
		// need to add this verification.
		const {
			world: newWorld,
			state: newState,
			player: newPlayer,
		} = this.gameConfig.makeMove(this.gameRuntime.world, this.gameRuntime.state, this.gameRuntime.turn, data.move)

		if (!newWorld || !newState || newState !== data.state || !isEqual(newWorld, data.world) || newPlayer !== data.player) {
			// mismatch!
			throw new Error('Mismatch! not implemented')
		}
		this.gameRuntime.world = newWorld
		this.gameRuntime.state = newState
		this.gameRuntime.turn = newPlayer
		this.gameUpdate()
	}

	makeMove = (move: M) => {
		const moveResult = this.gameConfig.makeMove(this.gameRuntime.world, this.gameRuntime.state, this.gameRuntime.turn, move)
		this.gameRuntime.state = moveResult.state
		this.gameRuntime.turn = moveResult.player
		this.gameRuntime.world = moveResult.world

		this.gameProxy.send('remoteTurn', { ...moveResult, move })
		this.gameUpdate()

		return moveResult
	}

	turn = () => this.gameRuntime.turn
	me = () => this.gameConfig.exState.me
	world = () => this.gameRuntime.world
	state = () => this.gameRuntime.state
}
