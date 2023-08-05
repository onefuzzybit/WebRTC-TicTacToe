import { useGameContext } from './config'
import { Circle, X } from 'react-feather'
import { FlowState, Player } from './types'

function statusStr(flowState: FlowState, side: Player, me: Player) {
	switch (flowState) {
		case FlowState.Turn:
			if (me === side) return 'Your turn'
			else return 'Opponent`s turn'
		case FlowState.Draw:
			return 'Game ended with draw'
		case FlowState.MismatchError:
			return 'Game aborted due to one of the side trying to cheat!'
		case FlowState.WinnerO: {
			const won = me === Player.O
			return <span style={{ color: won ? 'green' : 'red' }}>{`You ${won ? 'Win!!!' : 'lose...'}`}</span>
		}
		case FlowState.WinnerX: {
			const won = me === Player.X
			return <span style={{ color: won ? 'green' : 'red' }}>{`You ${won ? 'Win!!!' : 'lose...'}`}</span>
		}
	}
	return ''
}

export function StatusHeader() {
	const { game } = useGameContext()
	const status = statusStr(game.state(), game.turn(), game.me())

	let render = (
		<>
			<div>You play:</div>
			<div style={{ height: '100%', padding: '4px', backgroundColor: '#cccccc', boxSizing: 'border-box' }}>
				{game.me() === Player.O ? <Circle style={{ height: '100%' }} /> : <X style={{ height: '100%' }} />}
			</div>
			<div style={{ marginLeft: 'auto' }}>{status}</div>
		</>
	)
	let justify = 'flex-start'

	if (game.state() === FlowState.WinnerO || game.state() === FlowState.WinnerX) {
		render = <>{status}</>
		justify = 'center'
	}

	return (
		<div
			style={{
				height: '36px',
				width: '100%',
				whiteSpace: 'nowrap',
				display: 'flex',
				flexDirection: 'row',
				gap: '6px',
				justifyContent: justify,
				alignItems: 'center',
				backgroundColor: '#cccccc',
				border: 'solid 2px #aaaaaa',
				borderRadius: '6px',
				padding: '3px 8px',
				boxSizing: 'border-box',
			}}
		>
			{render}
		</div>
	)
}
