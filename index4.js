console.log('heloooo 4')

// 服务
{
	const app = require('express')()
	const http = require('http').createServer(app)
	const io = require('socket.io')(http)

	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/index.html')
	})

	const clients = {}

	io.on('connection', (socket) => {
		const name = socket.handshake.query.name
		clients[name] = socket
		console.log('connected', name)
		socket.on('disconnect', () => {
			console.log('disconnect', name)
			delete clients[name]
		})
		socket.on('msg', (msg) => {
			// console.log('got msg from', name, msg)
			socket.broadcast.emit('msg', msg)
		})
	})

	http.listen(3000, () => {
		console.log('listening on *:3000')
	})
}

// A

const io = require('socket.io-client')
const socket = io('http://localhost:3000', { query: { name: 'A' } })

window.socket = socket

setTimeout(() => socket.emit('msg', 'hello from A side ~~'), 3000)
socket.on('msg', (msg) => {
	console.log(msg)
})
