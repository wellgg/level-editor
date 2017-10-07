const {ipcRenderer} = require('electron')

const imgs = require('./scripts/assets.js').imgs
const blockSize = 64

let cnv = document.getElementById('cnv')
let container = document.getElementById('container')
let ctx = cnv.getContext('2d')

function draw()
{
    drawTiles()
    requestAnimationFrame(draw)
}

function drawTiles()
{
    for(let i = 0; i < imgs.length; i++)
    {
        ctx.drawImage(imgs[i], 0, i * blockSize, blockSize, blockSize)
    }
}

requestAnimationFrame(draw)

cnv.addEventListener('click', (event) =>
{
    let arg = Math.round(
        (event.pageY + document.getElementById('container').scrollTop
        + (.5 * blockSize)) / blockSize) - 1
    ipcRenderer.send('tile-click', arg);
    console.log(arg)
});

setTimeout(() =>
{
    cnv.height = container.height = imgs.length * blockSize
    cnv.width = container.width = blockSize
}, 1000)
