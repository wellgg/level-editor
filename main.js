const {app, BrowserWindow, ipcMain} = require('electron')
let win

app.on('ready', () => {
	win = new BrowserWindow({width: 1000, height:700})
	win.loadURL(`file://${__dirname}/setup.html`)
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

ipcMain.on('openMap', (event, arg) => {
    win.loadURL(require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, 'index.html')
    }))
    
    win.webContents.on('did-finish-load', () => {
        event.sender.send('openFile', arg)
    })
})