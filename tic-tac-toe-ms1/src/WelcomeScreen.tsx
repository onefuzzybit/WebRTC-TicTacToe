import { Board } from "./Board";
import { SquareState } from "./types";

export function WelcomeScreen() {
	return <>
		<WaitingOpponent />
		<Board state={Array(9).fill(SquareState.Empty)} />
	</>
}

export function WaitingOpponent() {
	return <div
		style={{
			position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
			textAlign: 'center', padding: '20px 30px', border: 'solid 1px #504050', backgroundColor: 'lightgray'
		}}
	>Waiting for opponent</div>
}