import { useEffect, useRef } from 'react'
import { NewSignallingClient, ConnectionStatus } from 'signalling-client'
import { FlowState } from './types'

export function useSignallingClient(setFlowState: (flowState: FlowState) => void) {
	const client = useRef<ReturnType<typeof NewSignallingClient>>()
	useEffect(() => {
		if (client.current) return
		client.current = NewSignallingClient({
			host: '130.211.73.30',
			port: 9090,
			timeout: 5000,
			onStatusChange: (status) => {
				status === ConnectionStatus.LoggedIn && setFlowState(FlowState.PendingStart)
				status === ConnectionStatus.GameOn && setFlowState(FlowState.InitiatingGame)
			},
		})
		client.current.login()
	}, [])
	return client.current
}
