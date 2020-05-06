console.log('1')

// signaling server
const ss = {}

// A
{
	const pc = new RTCPeerConnection()

	pc.createOffer()
		.then((sd) => {
			console.log('A SDP', sd)
			pc.setLocalDescription(sd)
				.then(() => {
					console.log('A setLocalDescription')
					// ss.description = sd
					ss.callB(sd)
				})
				.catch((e) => {
					console.error('A setLocalDescription', e)
				})
		})
		.catch((err) => {
			console.error('A SDP', err)
		})

	ss.callA = (description) => {
		pc.setRemoteDescription(description).then(() => console.log('A setRemoteDescription'))
	}
}

// B
{
	const pc = new RTCPeerConnection()

	ss.callB = (description) => {
		pc.setRemoteDescription(description).then(() => console.log('B setRemoteDescription'))
		pc.createAnswer().then((sd) => {
			console.log('B SDP', sd)
			pc.setLocalDescription(sd)
				.then(() => {
					console.log('B setLocalDescription')
					ss.callA(sd)
				})
				.catch((e) => {
					console.error('B setLocalDescription', e)
				})
		})
	}
}
