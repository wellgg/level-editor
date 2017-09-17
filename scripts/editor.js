// context for drawing to the canvas
let canvas = document.getElementById('cnv')
let ctx = canvas.getContext('2d')

// each tile is 16 by 16, but they are rendered as 48 by 48
const blocksize = 48

// gets asset files from assets.js
const imgs = require('./scripts/assets.js').imgs

// stores map and default map size
let map = []
let width = 10, height = 10

for (var i = 0; i < height; i++) {
	map.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
}

function draw() {
	drawMap()
	requestAnimationFrame(draw)
}

function drawMap() {
	for (var i = 0; i < map.length; i++) {
		for (var j = 0; j < map[i].length; j++) {
      ctx.drawImage(imgs[map[i][j]], i * blocksize, j * blocksize, blocksize, blocksize)
		}
	}
}

requestAnimationFrame(draw)