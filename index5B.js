console.log('haalo 5b')

const io = require('socket.io-client')
const socket = io('http://localhost:3000', { query: { name: 'B' } })

window.socket = socket

// B
setTimeout(() => {
	const pc = new RTCPeerConnection()
	window.B = pc
	//
	pc.addEventListener('icecandidate', (event) => {
		console.log('B icecandidate', event)
		socket.emit('candidate', event.candidate)
	})
	pc.addEventListener('iceconnectionstatechange', (event) => {
		console.log('B iceconnectionstatechange', event)
	})

	//
	socket.on('candidate', (msg) => {
		if (msg) {
			const can = new RTCIceCandidate(msg)
			pc.addIceCandidate(can)
		}
	})

	socket.on('description', (msg) => {
		const description = new RTCSessionDescription(msg)
		pc.setRemoteDescription(description).then(() => console.log('B setRemoteDescription'))
		pc.createAnswer().then((sd) => {
			console.log('B SDP', sd)
			pc.setLocalDescription(sd)
				.then(() => {
					console.log('B setLocalDescription')
					socket.emit('description', sd)
				})
				.catch((e) => {
					console.error('B setLocalDescription', e)
				})
		})
	})

	pc.ontrack = (e) => {
		const stream = e.streams[0]
		video.srcObject = stream
	}
}, 3000)
