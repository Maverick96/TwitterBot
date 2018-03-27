const rp = require('request-promise')
const fs = require('fs')
function downloadImage(postObject, tweet){
    if(postObject.imageUrl !== undefined){
        //extract image extenstion
        postObject.fileType = postObject.imageUrl.substr(postObject.imageUrl.lastIndexOf('.') + 1)
        postObject.fileName = "img1"
        let imgStream = fs.createWriteStream(postObject.fileName + "." + postObject.fileType)
        rp.get(postObject.imageUrl)
        .pipe(imgStream)
        .on('finish', () => {
            //close stream on completion
            imgStream.close()
            console.log("FINISHED downloading!");
            tweet(postObject)
        })
        .on('error', (err) => {
            console.log(err)
        })
    }
}

module.exports = downloadImage