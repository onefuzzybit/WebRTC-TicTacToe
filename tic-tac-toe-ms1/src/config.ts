import { GAME_TYPES, gameGenerator, ConnectionStatus } from '@onefuzzybit/game-proxy'
import { FlowState, Player, SquareState } from './types'
import { makeMove } from './logic'
import { useContext } from 'react'

if (!import.meta.env.VITE_SIGNALLING_HOST) throw new Error('Missing env variable VITE_SIGNALLING_HOST')
if (!import.meta.env.VITE_SSL) throw new Error('Missing env variable VITE_SIGNALLING_HOST')
if (!import.meta.env.VITE_SIGNALLING_PORT) throw new Error('Missing env variable VITE_SIGNALLING_HOST')

const game = gameGenerator(GAME_TYPES.TurnBased2Players, {
	players: { count: 2, names: [Player.O, Player.X] },
	exState: {},
	state: {
		availableStates: Object.values(FlowState) as FlowState[],
		firstGameState: FlowState.Turn,
		connectionStatusStateMap: {
			[ConnectionStatus.NotConnected]: FlowState.EstablishingConnection,
			[ConnectionStatus.Connected]: FlowState.InitiatingGame,
			[ConnectionStatus.LoggedIn]: FlowState.PendingStart,
		},
	},
	initWorldState: Array(9).fill(SquareState.Empty) as SquareState[],
	makeMove,
	connectionConfig: {
		host: import.meta.env.VITE_SIGNALLING_HOST,
		ssl: import.meta.env.VITE_SSL === 'true',
		port: import.meta.env.VITE_SIGNALLING_PORT,
		timeout: 5000,
		rtcConfig: {
			iceServers: [
				{
					urls: 'stun:stun.relay.metered.ca:80',
				},
				{
					urls: 'turn:a.relay.metered.ca:80',
					username: 'fa1b42917e570ac92413f878',
					credential: '2Mq0YI5YL9m5p9pu',
				},
				{
					urls: 'turn:a.relay.metered.ca:80?transport=tcp',
					username: 'fa1b42917e570ac92413f878',
					credential: '2Mq0YI5YL9m5p9pu',
				},
				{
					urls: 'turn:a.relay.metered.ca:443',
					username: 'fa1b42917e570ac92413f878',
					credential: '2Mq0YI5YL9m5p9pu',
				},
				{
					urls: 'turn:a.relay.metered.ca:443?transport=tcp',
					username: 'fa1b42917e570ac92413f878',
					credential: '2Mq0YI5YL9m5p9pu',
				},
			],
		},
	},
})

export function useGameContext() {
	return useContext(game.GameContext)
}

export const GameProvider = game.GameProvider
