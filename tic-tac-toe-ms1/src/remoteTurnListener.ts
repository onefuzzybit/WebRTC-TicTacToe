import { MutableRefObject } from 'react'
import { SignallingClient } from 'signalling-client'
import { makeMove } from './logic'
import { FlowState, Player, SquareState } from './types'
import equal from 'array-equal'

type Args = {
	client: SignallingClient
	board: MutableRefObject<SquareState[]>
	setFlowState: (f: FlowState) => void
	remoteSide: Player
}
let initialized = false
export function waitForRemoteTurn({ client, board, setFlowState, remoteSide }: Args) {
	if (initialized) return
	initialized = true
	client.incoming.addEventListener('message', (e: MessageEvent) => {
		const message = JSON.parse(e.data)
		if (message.type !== 'Turn') return
		const { remoteSquare, remoteBoard, remoteFlowState } = message as {
			remoteSquare: number
			remoteBoard: SquareState[]
			remoteFlowState: FlowState
		}
		const res = makeMove(board.current, remoteSquare, remoteSide === Player.O ? SquareState.O : SquareState.X)
		if (!res || res.newFlowState !== remoteFlowState || !equal(res.newBoard, remoteBoard)) {
			// mismatch!
			throw new Error('Mismatch! not implemented')
		}
		board.current = remoteBoard
		setFlowState(remoteFlowState)
	})
}

type SendTurnArgs = {
	client: SignallingClient
	board: MutableRefObject<SquareState[]>
	square: number
	flowState: FlowState
}
export function sendTurnMessage({ client, square, board, flowState }: SendTurnArgs) {
	client.outgoing.send(
		JSON.stringify({
			type: 'Turn',
			remoteSquare: square,
			remoteBoard: board.current,
			remoteFlowState: flowState,
		}),
	)
}
