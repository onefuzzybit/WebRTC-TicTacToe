import { useMemo } from 'react'
import { ReactNode, createContext } from 'react'
import { Player, GameTypeClass, GameTypeProxyConstructor, GameConfig } from './gameProxy.types'
import { useGameProxy } from './gameProxy'

export function gameGenerator<P extends Player, U, S, W, M, E, X extends GameTypeClass<P, S, W, M>>(
	gameClass: GameTypeProxyConstructor<P, U, S, W, M, E, X>,
	gameConfig: GameConfig<P, U, S, W, M, E>,
) {
	type GameProviderContext = {
		game: X
	}
	const GameContext = createContext({} as GameProviderContext)

	function GameProvider(p: { children: ReactNode }) {
		const { game, update } = useGameProxy(gameClass, gameConfig)

		const value: GameProviderContext = useMemo(() => ({ game }), [game, update])

		return <GameContext.Provider value={value}>{p.children}</GameContext.Provider>
	}

	return { GameProvider, GameContext }
}
