// context for drawing to the canvas
let canvas = document.getElementById('cnv')
let ctx = canvas.getContext('2d')

// each tile is 16 by 16, but they are rendered as 48 by 48
const blocksize = 48

// gets asset files from assets.js
const imgs = require('./scripts/assets.js').imgs

// gets ipcRenderer for async messages
const {ipcRenderer} = require('electron')
const {fs} = require('fs')

// stores map and default map size
let mapArray = [], startpoint
let name, width, height, map



function draw() {
	drawMap()
	requestAnimationFrame(draw)
}

function drawMap() {
	for (var i = 0; i < mapArray.length; i++) {
		for (var j = 0; j < mapArray[i].length; j++) {
            ctx.drawImage(imgs[mapArray[i][j]], i * blocksize, j * blocksize, blocksize, blocksize)
		}
	}
}

ipcRenderer.on('openFile', (event, arg) => {
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
    else
    {
        fs.readFile(arg, (err, data) => {
            if(err)
            {
                console.log('failed opening map')
            }
            map = JSON.parse(data.toString())
            
            name = map.name
            startpoint = map.startpoint
            mapArray = map.map
            
            canvas.style.height = (blocksize * mapArray.length) + 'px';
            canvas.style.width = (blocksize * mapArray[0].length) + 'px';
        })
    }
    
    requestAnimationFrame(draw)
})
