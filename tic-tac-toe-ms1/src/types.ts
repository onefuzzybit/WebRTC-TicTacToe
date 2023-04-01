export enum SquareState {
	Empty,
	X,
	O,
}

export enum FlowState {
	EstablishingConnection,
	PendingStart,
	InitiatingGame,
	TurnX,
	TurnO,
	WinnerX,
	WinnerO,
	Draw,
	MismatchError,
}

export enum Player {
	O,
	X,
}

export type GameState = {
	board: SquareState[]
	flowState: FlowState
	side: Player
}
