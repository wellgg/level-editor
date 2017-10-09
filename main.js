const {app, BrowserWindow, ipcMain, Menu} = require('electron')
let win, tilebar

app.on('ready', () =>
{
    // makes a new window
    win = new BrowserWindow(
    {
        width: 1000,
        height:700,
        defaultFontFamily: 'monospace',
        darkTheme: true,
        autoHideMenuBar: true
    })

    win.loadURL(`file://${__dirname}/setup.html`)

    tilebar = new BrowserWindow(
    {
        x: 100,
        y: 100,
        width: 80,
        height: 400,
        parent: win,
        frame: false,
        titleBarStyle: 'customButtonsOnHover',
        show: false,
        autoHideMenuBar: true
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
    win.loadURL(`file://${__dirname}/index.html`)

    // will send which file for the editor to open and shows tilebar
    win.webContents.on('did-finish-load', () =>
    {
        tilebar.show()
        event.sender.send('openFile', arg)
    })
})

ipcMain.on('tile-click', (event, arg) =>
{
    win.webContents.send('select-new-tile', arg)
    //event.sender.send('select-new-tile', arg)
})

ipcMain.on('new-again', (event, arg) =>
{
    win.reload()
    event.sender.send('openFile', 'null')
})
