import { useEffect, useState } from 'react'
import { Board } from './Board'
import { FlowState, SquareState } from './types'

export function WelcomeScreen(p: { flowState: FlowState }) {
	const getMessage = () => {
		switch (p.flowState) {
			case FlowState.EstablishingConnection:
				return 'Connecting...'
			case FlowState.PendingStart:
				return 'Waiting for opponent'
			case FlowState.InitiatingGame:
				return 'Initiating game'
		}
	}

	const [message, setMessage] = useState(getMessage())

	useEffect(() => {
		setMessage(getMessage())
	}, [p.flowState])

	return (
		<>
			<FloatingMessage text={message} />
			<Board state={Array(9).fill(SquareState.Empty)} active={false} />
		</>
	)
}

export function FloatingMessage(p: { text: string }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: '25%',
				left: '50%',
				transform: 'translateX(-50%)',
				textAlign: 'center',
				padding: '20px 30px',
				border: 'solid 1px #504050',
				backgroundColor: 'lightgray',
			}}
		>
			{p.text}
		</div>
	)
}
