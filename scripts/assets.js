// for reading the assets file
const fs = require('fs')
let imgs = []

fs.readdir('./assets', (err, files) => 
{
    if(err)
    {
        throw err
    }
    
    files.sort((a, b) =>
    {
        return a < b ? -1 : 1
    }).forEach((file) =>
    {
        //if(file.endsWith('.png'))
        let temp = new Image()
    
        temp.src = './assets/' + file
        imgs.push(temp)
    })
})

exports.imgs = imgs