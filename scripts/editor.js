// context for drawing to the canvas
let canvas = document.getElementById('cnv')
let ctx = canvas.getContext('2d')

// each tile is 16 by 16, but they are rendered as 64 by 64
const blockSize = 64

// gets asset files from assets.js
const imgs = require('./scripts/assets.js').imgs

// gets ipcRenderer for async messages
const {ipcRenderer} = require('electron')

// gets node's file system 
const fs = require('fs')

// stores map and default map size
let mapArray = [], startpoint
let name, width, height, map

// draw loop
function draw()
{
    drawMap()
    requestAnimationFrame(draw)
}

// function draws map to canvas from mapArray
function drawMap()
{
    for (var i = 0; i < mapArray.length; i++)
    {
        for (var j = 0; j < mapArray[i].length; j++)
        {
            ctx.drawImage(imgs[mapArray[j][i]], i * blockSize, j * blockSize, blockSize, blockSize)
        }
    }
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
        })
    }
    
    // updates canvas size to accomodate map size
    canvas.style.height = (blockSize * height) + 'px'
    canvas.style.width = (blockSize * width) + 'px'
    
    // starts draw loop
    requestAnimationFrame(draw)
})
