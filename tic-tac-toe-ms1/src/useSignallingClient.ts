import { useEffect } from "react";
import { NewSignallingClient, ConnectionStatus } from "signalling-client";
import { FlowState } from "./types";

export function useSignallingClient(setFlowState: (flowState: FlowState) => void) {
	useEffect(() => {
		const client = NewSignallingClient({
			host: 'localhost',
			port: 9090,
			timeout: 2000,
			onStatusChange: (status) => { status === ConnectionStatus.LoggedIn && setFlowState(FlowState.PendingStart) }
		})
		client.login()
	}, [])
}