import { Player, SquareState } from "./types";

type BoardProps = {
	state: SquareState[]
	onSquareClick?: (square: number) => void
}
export function Board({ state, onSquareClick }: BoardProps) {
	return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', width: '100%', height: '100%' }}>
		{state.map((square, i) => <BoardSquare key={i} state={square} onSquareClick={onSquareClick ? () => onSquareClick(i) : undefined  }/>)}
	</div>
}

type SquareProps = {
	state: SquareState
	onSquareClick?: VoidFunction
}
export function BoardSquare({ state, onSquareClick }: SquareProps) {
	return <div
		onClick={onSquareClick}
		style={{
			boxSizing: 'border-box', border: 'solid 1px black',
			fontSize: '20vh', lineHeight: '28vh', textAlign: 'center', fontFamily: 'cursive'
		}}
	>
		{state === SquareState.O && 'O'}
		{state === SquareState.X && 'X'}
	</div>
}