const electron = require('electron')

const { app, BrowserWindow } = require('electron')

function createWindow(html) {
	// 创建浏览器窗口
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	// 加载index.html文件
	win.loadFile(html)

	// 打开开发者工具
	win.webContents.openDevTools()
}

app.whenReady().then(() => {
	// createWindow('index1.html')
	// createWindow('index2.html')
	// createWindow('index3.html')
	// createWindow('index4.html')
	// createWindow('index4B.html')
	createWindow('index5.html')
	createWindow('index5B.html')
	// createWindow('./webrtc-web-master/step-02/index.html')
})
