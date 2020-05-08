console.log('heloooo 5')

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
		// 转发 description 和 candidate
		socket.on('description', (msg) => {
			socket.broadcast.emit('description', msg)
		})
		socket.on('candidate', (msg) => {
			socket.broadcast.emit('candidate', msg)
		})
	})

	http.listen(3000, () => {
		console.log('listening on *:3000')
	})
}

// A
setTimeout(() => {
	const io = require('socket.io-client')
	const socket = io('http://localhost:3000', { query: { name: 'A' } })

	window.socket = socket

	socket.on('msg', (msg) => {
		console.log(msg)
	})

	const pc = new RTCPeerConnection()
	window.A = pc
	//
	pc.addEventListener('icecandidate', (event) => {
		console.log('A icecandidate', event)
		socket.emit('candidate', event.candidate)
	})
	pc.addEventListener('iceconnectionstatechange', (event) => {
		console.log('A iceconnectionstatechange', event)
	})

	//
	socket.on('description', (msg) => {
		const description = new RTCSessionDescription(msg)
		pc.setRemoteDescription(description).then(() => console.log('A setRemoteDescription'))
	})
	socket.on('candidate', (msg) => {
		if (msg) {
			const can = new RTCIceCandidate(msg)
			pc.addIceCandidate(can)
		}
	})

	// 提供视频流
	const stream = video.captureStream()
	pc.addStream(stream)

	pc.createOffer()
		.then((sd) => {
			console.log('A SDP', sd)
			pc.setLocalDescription(sd)
				.then(() => {
					console.log('A setLocalDescription')
					socket.emit('description', sd)
				})
				.catch((e) => {
					console.error('A setLocalDescription', e)
				})
		})
		.catch((err) => {
			console.error('A SDP', err)
		})
}, 3000)
