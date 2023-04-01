import { SignallingClient } from 'signalling-client'
import { FlowState, Player } from './types'

let random: number | undefined
export function useRandomGameStart(
	client: SignallingClient,
	setPlayer: (p: Player) => void,
	setFlowState: (p: FlowState) => void,
) {
	if (!client || !client.outgoing || !client.incoming || random) return

	random = Math.random()
	client.outgoing.send(
		JSON.stringify({
			type: 'RandomStartValue',
			value: random,
		}),
	)

	function randomStarterCallback(e: MessageEvent) {
		console.log('starter callback got message', e.data)
		const message = JSON.parse(e.data)
		if (message.type !== 'RandomStartValue') return
		while (message.value === random) random = Math.random()
		if (message.value > random) return

		// randomize who is X
		const iAmX = Math.random() > 0.5

		// randomize who starts
		const xStarts = Math.random() > 0.5

		console.log('sending starter decision', iAmX, xStarts)
		client.outgoing.send(
			JSON.stringify({
				type: 'RandomStartDecision',
				youPlay: iAmX ? Player.O : Player.X,
				starts: xStarts ? Player.X : Player.O,
			}),
		)

		setPlayer(iAmX ? Player.X : Player.O)
		setFlowState(xStarts ? FlowState.TurnX : FlowState.TurnO)

		setTimeout(() => client.incoming.removeEventListener('message', randomStarterCallback), 0)
		setTimeout(() => client.incoming.removeEventListener('message', randomStarterDecisionCallback), 0)
	}
	client.incoming.addEventListener('message', randomStarterCallback)

	function randomStarterDecisionCallback(e: MessageEvent) {
		console.log('decision callback got message', e.data)
		const message = JSON.parse(e.data)
		if (message.type !== 'RandomStartDecision') return
		setPlayer(message.youPlay as Player)
		setFlowState((message.starts as Player) === Player.X ? FlowState.TurnX : FlowState.TurnO)
		setTimeout(() => client.incoming.removeEventListener('message', randomStarterDecisionCallback), 0)
		setTimeout(() => client.incoming.removeEventListener('message', randomStarterCallback), 0)
	}
	client.incoming.addEventListener('message', randomStarterDecisionCallback)
}
