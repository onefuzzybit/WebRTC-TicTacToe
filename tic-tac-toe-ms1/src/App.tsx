import { Layout } from './Layout'
import { useState } from 'react'
import { render } from 'react-dom'
import { FlowState } from './types'
import { WelcomeScreen } from './WelcomeScreen'

export function App() {
	const [flowState, setFlowState] = useState<FlowState>(FlowState.PendingStart)
	
	function render() {
		switch (flowState) {
			case FlowState.PendingStart: return <WelcomeScreen />
			default: return <div>not implemented</div>
		}
	}

	return <Layout>
		{render()}
	</Layout>
}