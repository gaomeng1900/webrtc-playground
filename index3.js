console.log('3')
// 双向数据流
// 单个数据体积限制 64kb/chrome
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels#Understanding_message_size_limits

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
	const channel = pc.createDataChannel('c')
	window.channelA = channel
	channel.onmessage = (m) => console.log('A', m)

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

	//
	pc.addEventListener('datachannel', (event) => {
		console.log('B datachannel', event)
		const channel = event.channel
		window.channelB = channel
		channel.onmessage = (m) => console.log('B', m)
	})
	ss.offerB = (description) => {
		pc.setRemoteDescription(description).then(() => console.log('B setRemoteDescription'))

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
	}
}
