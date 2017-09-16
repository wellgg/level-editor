const {app, BrowserWindow} = require('electron')
let win

app.on('ready', () => {
	win = new BrowserWindow({width: 1000, height:700})
	win.loadURL(`file://${__dirname}/index.html`)
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})