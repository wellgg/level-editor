// context for drawing to the canvas
let canvas = document.getElementById('cnv')
let ctx = canvas.getContext('2d')

// each tile is 16 by 16, but they are rendered as 64 by 64
const blockSize = 64

// gets asset files from assets.js
const imgs = require('./scripts/assets.js').imgs

// gets ipcRenderer for async messages
const {ipcRenderer, remote} = require('electron')
const {Menu, MenuItem, dialog} = remote

// gets node's file system
const fs = require('fs')
let fileLocation

// stores map and default map size
let mapArray = [], startpoint
let name, width, height, map

// brush tile (default is void tile)
let brushTile = 0,
    mouseX = 0,
    mouseY = 0

// menu on right click
const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click: (menuItem, browserWindow, event) =>
            {
                ipcRenderer.send('new-again', 0)
            }
        },
        {
            label: 'Open',
            accelerator: 'CmdOrCtrl+O',
            click: (menuItem, browserWindow, event) =>
            {
                window.location.replace('../open.html')
            }
        },
        {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click: (menuItem, browserWindow, event) =>
            {
                saveMap(fileLocation)
            }
        },
        {
            label: 'Save As',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: (menuItem, browserWindow, event) =>
            {
                saveMap('null')
            }
        }
    ]
}))

function saveMap(file)
{
    let saveMap =
    {
        name: name,
        startpoint: startpoint,
        map: mapArray
    }

    if(file == 'null')
    {
        file = dialog.showSaveDialog(
        {
            title: 'Select Map',
            message: 'pls select gud map'
        })
    }

    fs.writeFile(file, JSON.stringify(saveMap), (err) =>
    {
        if(err) throw err
        console.log('saved file')
    })
}

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
}, false)

document.onmousemove = (event) =>
{
    mouseX = event.clientX
    mouseY = event.clientY
}

canvas.onmouseup = (event) =>
{
    let mapX = Math.round((event.clientX - (.5 * blockSize)) / blockSize),
        mapY = Math.round((event.clientY - (.5 * blockSize)) / blockSize);

    if(event.button == 0)
    {
        mapArray[mapX][mapY] = brushTile
    }
    else if(event.button == 1)
    {
        brushTile = mapArray[mapX][mapY];
    }
}

// draw loop
function draw()
{
    clearCanvas()
    drawMap()
    drawBrush()
    requestAnimationFrame(draw)
}

// clears canvas
function clearCanvas()
{
    ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight)
}

// function draws map to canvas from mapArray
function drawMap()
{
    for (var i = 0; i < mapArray.length; i++)
    {
        for (var j = 0; j < mapArray[i].length; j++)
        {
            ctx.drawImage(imgs[mapArray[i][j]], i * blockSize, j * blockSize, blockSize, blockSize)
        }
    }

}

// draws the tile at mouse coords
function drawBrush()
{
    ctx.drawImage(imgs[brushTile], mouseX, mouseY, blockSize, blockSize)
}

// this callback acts as an init function, as it gets called first
ipcRenderer.on('openFile', (event, arg) =>
{
    // creates a new map for users to edit
    if(arg === 'null')
    {
        width = 10
        height = 10
        for (var i = 0; i < height; i++)
        {
            mapArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        }
        name = 'new-map.json'
        startpoint = [0, 0]
        fileLocation = 'null'
    }
    // opens a previously existing map file
    else
    {
        fs.readFile(arg, (err, data) =>
        {
            if(err)
            {
                throw err
            }

            // gets JSON from file and converts to an object
            map = JSON.parse(data.toString())

            // sets global editor vars
            name = map.name
            startpoint = map.startpoint
            mapArray = map.map

            height = mapArray.length
            width = mapArray[0].length

            fileLocation = arg
        })
    }

    // updates canvas size to accomodate map size
    canvas.style.height = (blockSize * height) + 'px'
    canvas.style.width = (blockSize * width) + 'px'

    // starts draw loop
    requestAnimationFrame(draw)
})

ipcRenderer.on('select-new-tile', (event, arg) =>
{
    brushTile = arg
})
