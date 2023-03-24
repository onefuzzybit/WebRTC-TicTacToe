import { SquareState } from "./types";

export function Board({ state }: {state: SquareState[]}) {
	return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', width: '100%', height: '100%'}}>
		{state.map((square) => <BoardSquare state={square} />)}
	</div>
}

export function BoardSquare({ state }: { state: SquareState }) {
	return <div style={{
		boxSizing: 'border-box', border: 'solid 1px black',
		fontSize: '20vh', lineHeight: '28vh', textAlign: 'center', fontFamily: 'cursive'
	}}>
		{state === SquareState.O && 'O'}
		{state === SquareState.X && 'X'}
	</div>
}