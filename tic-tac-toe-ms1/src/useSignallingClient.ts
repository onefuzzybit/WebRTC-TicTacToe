import { useEffect, useRef } from 'react'
import { NewSignallingClient, ConnectionStatus } from 'signalling-client'
import { FlowState } from './types'

export function useSignallingClient(setFlowState: (flowState: FlowState) => void) {
	const client = useRef<ReturnType<typeof NewSignallingClient>>()
	useEffect(() => {
		if (client.current) return
		client.current = NewSignallingClient({
			// host: 'signalling.one-fuzzy-bit.com',
			host: 'localhost',
			port: 9090,
			timeout: 5000,
			rtcConfig: {
				iceServers: [
					{
						urls: ['stun:stun2.1.google.com:19302'],
					},
					// {
					// 	urls: ['turn:35.210.239.175:3478'],
					// 	username: 'turn',
					// 	credential: 'turnpass',
					// 	credentialType: 'password',
					// 	iceTransportPolicy: 'relay',
					// },
				],
			},
			onStatusChange: (status) => {
				status === ConnectionStatus.LoggedIn && setFlowState(FlowState.PendingStart)
				status === ConnectionStatus.DataChannelOpen && setFlowState(FlowState.InitiatingGame)
			},
		})
		client.current.login()
	}, [])
	return client.current
}
