const {app, BrowserWindow, ipcMain, Menu} = require('electron')
let win, tilebar

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Save'
            },
            {
                label: 'Save As'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'togglefullscreen'
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)

app.on('ready', () =>
{
    // makes a new window
    win = new BrowserWindow(
    {
        width: 1000,
        height:700,
        defaultFontFamily: 'monospace',
        darkTheme: true
    })

    win.loadURL(`file://${__dirname}/setup.html`)
    win.setMenu(menu)

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

ipcMain.on('tile-click', (event, arg) =>
{
    win.webContents.send('select-new-tile', arg)
    //event.sender.send('select-new-tile', arg)
})
