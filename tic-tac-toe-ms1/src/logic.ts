import { BoardSquare } from "./Board";
import { FlowState, Player, SquareState } from "./types";

let winningCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,4,8],
	[2,4,6],
	[0,3,6],
	[1,4,7],
	[2,5,8],
]
export function findWinner(board: SquareState[]) {
	for (const combo of winningCombos) {
		if (combo.every((i) => board[i] === SquareState.O)) return Player.O
		if (combo.every((i) => board[i] === SquareState.X)) return Player.X
	}
}

export function makeMove(board: SquareState[], square: number, state: SquareState) {
	if (square < 0 || square > 8) throw new Error(`Invalid square index ${square}`)
	if (state === SquareState.Empty) throw new Error(`Invalid new state ${state}`)
	if (board[square] !== SquareState.Empty) return console.log('Square is already taken')
	
	const newBoard = [...board]
	newBoard.splice(square, 1, state)

	const winner = findWinner(newBoard)
	let newFlowState: FlowState = state === SquareState.O ? FlowState.TurnX : FlowState.TurnO
	if (winner === Player.X) newFlowState = FlowState.WinnerX
	if (winner === Player.O) newFlowState = FlowState.WinnerO

	// if there's no winner and no more empty squares - draw.
	if (!winner && newBoard.findIndex((s) => s === SquareState.Empty) === -1) newFlowState = FlowState.Draw

	return { newBoard, newFlowState }
}
