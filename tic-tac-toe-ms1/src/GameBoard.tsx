import { memo } from 'react'
import { Board } from './Board'
import { useGameState } from './StateProvider'
import { FlowState, Player } from './types'

function myTurn(flowState: FlowState, side: Player) {
	return flowState === FlowState.TurnX && side === Player.X || flowState === FlowState.TurnO && side === Player.O 
}
function statusStr(flowState: FlowState, side: Player) {
	if (myTurn(flowState, side)) return 'Your turn'
	if (flowState === FlowState.TurnX || flowState === FlowState.TurnO) return 'Opponent`s turn'
	switch (flowState) {
	case FlowState.Draw: return 'Game ended with draw'
	case FlowState.MismatchError: return 'Game aborted due to one of the side trying to cheat!'
	case FlowState.WinnerO: return `You ${side === Player.O ? 'Won :-)' : 'lost :-('}`
	case FlowState.WinnerX: return `You ${side === Player.X ? 'Won :-)' : 'lost :-('}`
	}
	return ''
}

export function _GameBoard() {
	const state = useGameState()
	const status = statusStr(state.flowState, state.side)
 
	return <div style={{position: 'relative', height: '100%'}}>
		<div style={{ 
			position: 'absolute', left: '50%', right: '50%', top: '-10px', transform: 'translate(-50%, -100%)', width: 'fit-content', whiteSpace: 'nowrap'
		}}>
			{status}
		</div>
		<Board state={state.board} onSquareClick={myTurn(state.flowState, state.side) ? state.setSquare : undefined} />
	</div>
}
export const GameBoard = memo(_GameBoard)