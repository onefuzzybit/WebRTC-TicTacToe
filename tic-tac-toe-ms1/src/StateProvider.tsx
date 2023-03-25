import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { FlowState, GameState, Player, SquareState } from "types";

export type GameStateContext = GameState & {
	setFlowState: (v: FlowState) => void
	setSquare: (square: number, value: SquareState) => void
}
const Context = createContext<GameStateContext>({} as GameStateContext)

type Props = {
	children: ReactNode, 
	side: Player,
	flowState: FlowState
	setFlowState: (state: FlowState) => void
}
export function GameStateProvider({children, side, flowState, setFlowState}: Props) {
	const [board, setBoard] = useState<SquareState[]>(Array(length).fill(SquareState.Empty))

	const setSquare = useMemo(() => (square: number, value: SquareState.O | SquareState.X) => {
		if (square < 0 || square > 8) throw new Error(`Invalid square index ${square}`)
		if (![SquareState.O, SquareState.X].includes(value)) throw new Error(`Invalid value ${value} for square ${square}`)
		if (board[square] !== SquareState.Empty) throw new Error(`Square ${square} already contains value ${board[square]}`)
		setBoard(board.splice(square, 1, value))
	}, [board])

	const value = useMemo(() => ({ flowState, side, board, setFlowState, setSquare }), [board, flowState, side])
	return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useGameState() {
	return useContext(Context)
}