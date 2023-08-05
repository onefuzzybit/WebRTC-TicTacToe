import { FlowState, Player, SquareState } from './types'

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 4, 8],
	[2, 4, 6],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
]

export function getWinningCombo(board: SquareState[], player: Player) {
	return winningCombos.find((c) => c.every((i) => board[i] === (player === Player.X ? SquareState.X : SquareState.O)))
}

export function findWinner(board: SquareState[]) {
	const oWinner = getWinningCombo(board, Player.O)
	if (oWinner) return Player.O

	const xWinner = getWinningCombo(board, Player.X)
	if (xWinner) return Player.X
}

export type Move = { square: number; state: SquareState }
export function makeMove(board: SquareState[], state: FlowState, player: Player, move: Move) {
	if (state !== FlowState.Turn) throw new Error(`Cannot make move when state is different from "Turn". current state: ${state}`)
	if (move.square < 0 || move.square > 8) throw new Error(`Invalid square index ${move.square}`)
	if (move.state === SquareState.Empty) throw new Error(`Invalid new state ${move.state}`)
	if (board[move.square] !== SquareState.Empty) throw new Error('Square is already taken')
	if (player === Player.O && move.state !== SquareState.O) throw new Error('Player O can only set square value to O')
	if (player === Player.X && move.state !== SquareState.X) throw new Error('Player X can only set square value to X')

	const newBoard = [...board]
	newBoard.splice(move.square, 1, move.state)

	const winner = findWinner(newBoard)
	let newFlowState: FlowState = FlowState.Turn
	if (winner === Player.X) newFlowState = FlowState.WinnerX
	if (winner === Player.O) newFlowState = FlowState.WinnerO

	// if there's no winner and no more empty squares - draw.
	if (typeof winner === undefined && newBoard.findIndex((s) => s === SquareState.Empty) === -1) newFlowState = FlowState.Draw

	return { world: newBoard, state: newFlowState, player: player === Player.O ? Player.X : Player.O }
}
