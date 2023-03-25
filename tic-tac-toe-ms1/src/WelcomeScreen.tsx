import { useEffect, useState } from "react";
import { Board } from "./Board";
import { FlowState, SquareState } from "./types";

export function WelcomeScreen(p: {flowState: FlowState}) {
	const getMessage = () => p.flowState === FlowState.EstablishingConnection ? 'Connecting...' : 'Waiting for opponent'
	const [message, setMessage] = useState(getMessage())

	useEffect(() => { setMessage(getMessage()) }, [p.flowState])

	return <>
		<FloatingMessage text={message} />
		<Board state={Array(9).fill(SquareState.Empty)} />
	</>
}

export function FloatingMessage(p: { text: string }) {
	return <div
		style={{
			position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
			textAlign: 'center', padding: '20px 30px', border: 'solid 1px #504050', backgroundColor: 'lightgray'
		}}
	>{p.text}</div>
}