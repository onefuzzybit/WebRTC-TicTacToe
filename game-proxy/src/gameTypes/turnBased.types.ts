/* eslint-disable @typescript-eslint/no-empty-interface */
import { GameConfig, GameRuntime, GameTypeClass, Player } from '../gameProxy.types'

export type TurnBasedConfigExState<P> = {
	starting: P // the first player
	me: P // the current player
}
export type TurnBasedConfig<P extends Player, U, S, W, M> = GameConfig<P, U, S, W, M, TurnBasedConfigExState<P>>

export interface TurnBasedGameType<P extends Player, S, W, M> extends GameTypeClass<P, S, W, M> {
	turn: () => P
	me: () => P
	world: () => W
	state: () => S
}

export interface TurnBasedGameRuntime<W, S, P> extends GameRuntime<W, S> {
	turn: P
}
