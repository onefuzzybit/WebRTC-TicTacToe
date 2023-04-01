import { Layout } from './Layout'
import { useState } from 'react'
import { FlowState, Player } from './types'
import { WelcomeScreen } from './WelcomeScreen'
import { useSignallingClient } from './useSignallingClient'
import { useRandomGameStart } from './useRandomGameStart'
import { GameStateProvider } from './StateProvider'
import { GameBoard } from './GameBoard'

export function App() {
	const [flowState, setFlowState] = useState<FlowState>(FlowState.EstablishingConnection)
	const [player, setPlayer] = useState<Player>()

	const client = useSignallingClient(setFlowState)
	useRandomGameStart(client, setPlayer, setFlowState)

	function render() {
		switch (flowState) {
		case FlowState.EstablishingConnection:
		case FlowState.PendingStart:
		case FlowState.InitiatingGame: return <WelcomeScreen flowState={flowState} />
		default: return <>
			<GameStateProvider
				side={player} 
				flowState={flowState}
				setFlowState={setFlowState}
				client={client}
			>
				<GameBoard />
			</GameStateProvider>
		</>
		}
	}

	return <Layout>
		{render()}
	</Layout>
}
