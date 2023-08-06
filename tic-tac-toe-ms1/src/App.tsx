import { Layout } from './Layout'
import { FlowState } from './types'
import { WelcomeScreen } from './WelcomeScreen'
import { GameBoard } from './GameBoard'
import { GameProvider, useGameContext } from './config'

export function App() {
	return (
		<Layout>
			<GameProvider>
				<TicTacToe />
			</GameProvider>
		</Layout>
	)
}

export function TicTacToe() {
	const { game } = useGameContext()

	function render() {
		if (!game) return <WelcomeScreen flowState={FlowState.EstablishingConnection} />

		switch (game.state()) {
			case undefined:
				return <WelcomeScreen flowState={FlowState.EstablishingConnection} />
			case FlowState.EstablishingConnection:
			case FlowState.PendingStart:
			case FlowState.InitiatingGame:
				return <WelcomeScreen flowState={game.state()} />
			default:
				return <GameBoard />
		}
	}
	return (
		<>
			<div style={{ position: 'absolute', top: 0, left: 0 }}>version 1.0.6</div>
			{render()}
		</>
	)
}
