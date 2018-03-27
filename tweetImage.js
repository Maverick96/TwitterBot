const fs = require('fs')
const config = new require(__dirname + '/config.js')
const twitter = require('twitter')
const twitterClient = new twitter(config)

function tweetImage(imageData) {
    // Load your image
    const image = fs.readFileSync(imageData.fileName + "." + imageData.fileType);
    console.log("Reaching here" + imageData.fileName)
    // Make post request on media endpoint. Pass file data as media parameter
    twitterClient.post('media/upload', {media: image}, function(error, media, response) {
        console.log("Inside Post")
        if (!error) {
            // If successful, a media object will be returned.
           // console.log(media)
            let status = {
            status: imageData.title,
            media_ids: media.media_id_string // Pass the media id string
            }
            //Tweet
            twitterClient.post('statuses/update', status, function(error, tweet, response) {
            if (!error) {
                console.log("tweeted")
            }
             else
                console.log(error)
            })

        }
        else 
            console.log(error)
    })
}
module.exports = tweetImage