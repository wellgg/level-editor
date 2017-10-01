const {app, BrowserWindow, ipcMain} = require('electron')
let win, tilebar

app.on('ready', () =>
{
    // makes a new window
	win = new BrowserWindow({width: 1000, height:700, defaultFontFamily: 'monospace'})
	win.loadURL(`file://${__dirname}/setup.html`)
    
    tilebar = new BrowserWindow(
    {
        x: 100,
        y: 100,
        width: 80,
        height: 400,
        parent: win,
        resizeable: false,
        frame: false,
        titleBarStyle: 'customButtonsOnHover',
        //focusable: false,
        show: false
    })
    
    tilebar.loadURL(`file://${__dirname}/tilebar.html`)
})

// will close the app on mac when close [x] button is hit properly
// PS: mac users, pls learn to use minimize instead of the close [x] button
app.on('window-all-closed', () =>
{
	if (process.platform !== 'darwin')
    {
		app.quit()
	}
})


ipcMain.on('openMap', (event, arg) =>
{
    win.loadURL(require('url').format(
    {
        protocol: 'file', 
        slashes: true,
        pathname: require('path').join(__dirname, 'index.html')
    }))
    
    // will send which file for the editor to open and shows tilebar
    win.webContents.on('did-finish-load', () =>
    {
        tilebar.show()
        event.sender.send('openFile', arg)
    })
})