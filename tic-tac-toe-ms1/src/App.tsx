import { Layout } from './Layout'
import { useState } from 'react'
import { FlowState } from './types'
import { WelcomeScreen } from './WelcomeScreen'
import { useSignallingClient } from './useSignallingClient'

export function App() {
	const [flowState, setFlowState] = useState<FlowState>(FlowState.EstablishingConnection)
	useSignallingClient(setFlowState)

	function render() {
		switch (flowState) {
			case FlowState.EstablishingConnection:
			case FlowState.PendingStart: return <WelcomeScreen flowState={flowState} />
			default: return <div>not implemented</div>
		}
	}

	return <Layout>
		{render()}
	</Layout>
}
