import React from 'react'
import { SquareState } from './types'
import { Circle, X } from 'react-feather'

type BoardProps = {
	state: SquareState[]
	onSquareClick?: (square: number) => void
	winner?: boolean
	highlight?: number[]
	active: boolean
}
export function Board({ state, onSquareClick, winner, highlight, active }: BoardProps) {
	return (
		<div
			style={{
				display: 'grid',
				gridGap: '5px',
				gridTemplateColumns: '1fr 1fr 1fr',
				gridTemplateRows: '1fr 1fr 1fr',
				height: '100%',
				aspectRatio: '1/1',
				borderRadius: '16px',
				background: 'radial-gradient(at left 8px top 8px	, rgba(255,255,255,1) 0%, rgba(35,164,207,1) 6%, rgba(3,117,180,1) 100%)',
				padding: '8px',
				boxShadow: '0px 0px 12px 3px rgba(0,0,0,0.57)',
				boxSizing: 'border-box',
			}}
		>
			{state.map((square, i) => (
				<BoardSquare
					key={i}
					state={square}
					onSquareClick={onSquareClick ? () => onSquareClick(i) : undefined}
					winner={highlight?.includes(i) ? winner : undefined}
					active={active}
				/>
			))}
		</div>
	)
}

type SquareProps = {
	state: SquareState
	onSquareClick?: VoidFunction
	winner?: boolean
	active: boolean
}
export function BoardSquare({ state, onSquareClick, winner, active }: SquareProps) {
	let bgColor = 'rgba(220,220,220,0.8)'
	if (typeof winner !== 'undefined') bgColor = winner ? '#95ee11' : '#c74038'

	const cursor = active && state === SquareState.Empty ? 'pointer' : 'default'

	return (
		<div
			onClick={onSquareClick}
			style={{
				borderRadius: '16px',
				boxSizing: 'border-box',
				backgroundColor: bgColor,
				border: 'inset 2px rgba(160,160,160,0.9)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor,
			}}
		>
			{state === SquareState.O && <Circle style={{ height: '60%', width: '60%' }} />}
			{state === SquareState.X && <X style={{ height: '80%', width: '80%' }} />}
		</div>
	)
}
