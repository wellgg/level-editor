let assets = ['void.png', 'grayrough.png', 'yellowrough.png']
let imgs = []

for(let i = 0; i < assets.length; i++) {
  let temp = new Image()
  temp.src = './assets/' + assets[i]
  
  imgs.push(temp)
}

exports.assetList = assets
exports.imgs = imgs