console.log('haalo 4b')

const io = require('socket.io-client')
const socket = io('http://localhost:3000', { query: { name: 'B' } })

window.socket = socket

setTimeout(() => socket.emit('msg', 'hello from the other side ~~'), 3000)
socket.on('msg', (msg) => {
	console.log(msg)
})
