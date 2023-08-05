import { memo, useEffect, useState } from 'react'
import { Board } from './Board'
import { FlowState, Player } from './types'
import { useGameContext } from './config'
import { SquareState } from './types'
import { getWinningCombo } from './logic'
import { StatusHeader } from './StatusHeader'

export function _GameBoard() {
	const { game } = useGameContext()
	const sign = game.me() === Player.O ? SquareState.O : SquareState.X
	const [highlight, setHighlight] = useState([])
	const [winner, setWinner] = useState(false)

	useEffect(() => {
		if (game.state() === FlowState.WinnerO) {
			setHighlight(getWinningCombo(game.world(), Player.O))
			setWinner(game.me() === Player.O)
		}
		if (game.state() === FlowState.WinnerX) {
			setHighlight(getWinningCombo(game.world(), Player.X))
			setWinner(game.me() === Player.X)
		}
	})

	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
				boxSizing: 'border-box',
			}}
		>
			<StatusHeader />
			<div style={{ flex: 1 }}>
				<Board
					state={game.world()}
					onSquareClick={(s: number) => (game.turn() === game.me() ? game.makeMove({ square: s, state: sign }) : undefined)}
					highlight={highlight}
					winner={winner}
					active={game.turn() === game.me()}
				/>
			</div>
		</div>
	)
}
export const GameBoard = memo(_GameBoard)
