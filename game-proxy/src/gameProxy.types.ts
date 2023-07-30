import { ConnectionStatus, SignallingClientConfig } from 'signalling-client'

export type Player = string | number
export type GameTypeProxyConstructor<P extends Player, U, S, W, M, E, X extends GameTypeClass<P, S, W, M>> = new (
	gameConfig: GameConfig<P, U, S, W, M, E>,
	gameUpdate: VoidFunction,
) => X

// input current world, state, player and move to make.
// return new world, state, player.
export type MoveFunction<W, S, P, M> = (world: W, state: S, player: P, move: M) => { world: W; state: S; player: P }

// generics:
// P - names of players
// U - additional player configuration
// S - state structure
// W - world state
// M - description of player movement
export interface GameConfig<P extends Player, U, S, W, M, E> {
	players: {
		count: number | { min: number; max: number }
		names: P[]
		config?: { [key in P]: U }
	}
	exState: E // extended state for specific game types.
	state: {
		availableStates: S[]
		firstGameState: S
		connectionStatusStateMap: { [key in ConnectionStatus]?: S }
	}
	initWorldState: W
	makeMove: MoveFunction<W, S, P, M>
	minWaitTime?: number
	connectionConfig: SignallingClientConfig
}

export interface GameTypeClass<P extends Player, S, W, M> {
	makeMove: (move: M) => { world: W; state: S; player: P }
}

export interface GameRuntime<W, S> {
	world: W
	state: S
}
