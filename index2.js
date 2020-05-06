console.log('2')
// 双向视频流

// signaling server
const ss = {}

// A
{
	const pc = new RTCPeerConnection()
	window.A = pc
	//
	pc.addEventListener('icecandidate', (event) => {
		console.log('A icecandidate', event)
		ss.candidateB(event.candidate)
	})
	pc.addEventListener('iceconnectionstatechange', (event) => {
		console.log('A iceconnectionstatechange', event)
	})

	//
	ss.answerA = (description) => {
		pc.setRemoteDescription(description).then(() => console.log('A setRemoteDescription'))
	}
	ss.candidateA = (candidate) => {
		if (candidate) {
			const can = new RTCIceCandidate(candidate)
			pc.addIceCandidate(can)
		}
	}

	// 提供视频流
	navigator.mediaDevices
		.getUserMedia({
			video: { width: 1280, height: 720 },
		})
		.then((stream) => {
			pc.addStream(stream)
			// video1.srcObject = pc.getRemoteStreams()[0]
			// video1.srcObject = pc.getLocalStreams()[0]

			pc.createOffer()
				.then((sd) => {
					console.log('A SDP', sd)
					pc.setLocalDescription(sd)
						.then(() => {
							console.log('A setLocalDescription')
							// ss.description = sd
							ss.offerB(sd)
						})
						.catch((e) => {
							console.error('A setLocalDescription', e)
						})
				})
				.catch((err) => {
					console.error('A SDP', err)
				})
		})
}

// B
{
	const pc = new RTCPeerConnection()
	window.B = pc
	//
	pc.addEventListener('icecandidate', (event) => {
		console.log('B icecandidate', event)
		ss.candidateA(event.candidate)
	})
	pc.addEventListener('iceconnectionstatechange', (event) => {
		console.log('B iceconnectionstatechange', event)
	})

	//
	ss.candidateB = (candidate) => {
		if (candidate) {
			const can = new RTCIceCandidate(candidate)
			pc.addIceCandidate(can)
		}
	}
	ss.offerB = (description) => {
		pc.setRemoteDescription(description).then(() => console.log('B setRemoteDescription'))

		// 提供视频流
		navigator.mediaDevices
			.getUserMedia({
				video: { width: 100, height: 200 },
			})
			.then((stream) => {
				pc.addStream(stream)

				pc.createAnswer().then((sd) => {
					console.log('B SDP', sd)
					pc.setLocalDescription(sd)
						.then(() => {
							console.log('B setLocalDescription')
							ss.answerA(sd)
						})
						.catch((e) => {
							console.error('B setLocalDescription', e)
						})
				})
			})
	}
}
