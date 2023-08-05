import { IncomingMessage } from 'http'
import { Server, WebSocket } from 'ws'
import { readFileSync } from 'fs'
import { createServer } from 'https'

function getSSLOptions() {
	return {
		key: readFileSync('/etc/letsencrypt/live/signalling.one-fuzzy-bit.com/privkey.pem'),
		cert: readFileSync('/etc/letsencrypt/live/signalling.one-fuzzy-bit.com/fullchain.pem'),
	}
}

export function socketServer(onConnection: (conn: WebSocket, message: IncomingMessage) => void) {
	if (!process.env.SIGNALLING_PORT) throw new Error('Missing env variable SIGNALLING_PORT')
	if (!process.env.SSL) throw new Error('Missing env variable SSL')

	const port = parseInt(process.env.SIGNALLING_PORT)

	if (typeof port !== 'number') throw new Error(`Invalid value "${process.env.SIGNALLING_PORT}" for env variable SIGNALLING_PORT`)

	const ssl = process.env.SSL === 'true'

	if (ssl) {
		const server = createServer(getSSLOptions(), (req, res) => {
			res.writeHead(200)
			res.end()
		})

		server.on('error', (err) => console.error(err))
		server.listen(port, () => {
			console.log(`Https running on port ${port}`)

			const wss = new Server({ server, path: '/ws' })
			wss.on('connection', onConnection)
		})
	} else {
		const wss = new Server({ port, path: '/ws' })
		wss.on('connection', onConnection)
		console.log(`Webserver waiting for connections on port ${port}...`)
	}
}
