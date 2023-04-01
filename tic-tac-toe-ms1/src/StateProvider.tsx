import { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from 'react'
import { FlowState, GameState, Player, SquareState } from './types'
import { SignallingClient } from 'signalling-client'
import { makeMove } from './logic'
import { sendTurnMessage, waitForRemoteTurn } from './remoteTurnListener'

export type GameStateContext = GameState & {
	setFlowState: (v: FlowState) => void
	setSquare: (square: number) => void
}
const Context = createContext<GameStateContext>({} as GameStateContext)

type Props = {
	children: ReactNode, 
	side: Player,
	flowState: FlowState
	setFlowState: (state: FlowState) => void
	client: SignallingClient
}
export function GameStateProvider({children, side, flowState, setFlowState, client}: Props) {
	const board = useRef<SquareState[]>(Array(9).fill(SquareState.Empty))

	useEffect(() => { waitForRemoteTurn({client, board, setFlowState, remoteSide: side === Player.O ? Player.X : Player.O}) }, [])

	const setSquare = useMemo(() => (square: number) => {
		const res = makeMove(board.current, square, side === Player.X ? SquareState.X : SquareState.O)
		if (res) {
			board.current = res.newBoard
			setFlowState(res.newFlowState)
			sendTurnMessage({client, square, board, flowState: res.newFlowState})
		}
	}, [board])

	const value = useMemo(() => ({ flowState, side, board: board.current, setFlowState, setSquare }), [board.current, flowState, side])
	return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useGameState() {
	return useContext(Context)
}
