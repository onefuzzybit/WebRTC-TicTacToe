import { memo } from 'react'
import { Board } from './Board'
import { FlowState, Player } from './types'
import { useGameContext } from './config'
import { SquareState } from './types'

function statusStr(flowState: FlowState, side: Player, me: Player) {
	switch (flowState) {
		case FlowState.Turn:
			if (me === side) return 'Your turn'
			else return 'Opponent`s turn'
		case FlowState.Draw:
			return 'Game ended with draw'
		case FlowState.MismatchError:
			return 'Game aborted due to one of the side trying to cheat!'
		case FlowState.WinnerO:
			return `You ${me === Player.O ? 'Won :-)' : 'lost :-('}`
		case FlowState.WinnerX:
			return `You ${me === Player.X ? 'Won :-)' : 'lost :-('}`
	}
	return ''
}

export function _GameBoard() {
	const { game } = useGameContext()
	const status = statusStr(game.state(), game.turn(), game.me())
	const sign = game.me() === Player.O ? SquareState.O : SquareState.X

	return (
		<div style={{ position: 'relative', height: '100%' }}>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					right: '50%',
					top: '-10px',
					transform: 'translate(-50%, -100%)',
					width: 'fit-content',
					whiteSpace: 'nowrap',
				}}
			>
				{status}
			</div>
			<Board state={game.world()} onSquareClick={(s: number) => game.turn() === game.me() ? game.makeMove({ square: s, state: sign}) : undefined} />
		</div>
	)
}
export const GameBoard = memo(_GameBoard)
