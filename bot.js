const rp = require('request-promise')
const downloadImage = require(__dirname + "/downloadImage.js")
const tweetImage = require(__dirname + "/tweetImage")
// const tweetVideo = require(__dirname + "/tweetVideo")
const postedImageIds = {}

function startTweeting (id){
    let lastId = id
    console.log("LASt " + lastId)
    setInterval(function tweet() {
        let url = "http://www.reddit.com/r/funny/top/.json?"
        
        if(lastId !== undefined)
            url = url + "after=" + lastId + "&"
        console.log(url)
        url = url + "limit=5"
        rp.get(url)
        .then((dataString) => {
        //  console.log(data)
            data = JSON.parse(dataString)
            let postObject = {}    // To store imageUrl and title
            data.data.children.some((child) => {
                //only post, if previously not posted
                postObject = {}
                if(postedImageIds[child.data.id] === undefined){
                    if(child.data.preview.reddit_video_preview === undefined && child.data.is_video === false){
                        console.log(child.data.title + child.data.id)
                        postedImageIds[child.data.id] = true
                        postObject.imageUrl = child.data.url
                        postObject.title = child.data.title
                        lastId = child.data.name
                        return true
                    }
                    else {
                        console.log("IS gif/video" + child.data.title)
                        lastId = child.data.name
                    }
                }
                else
                console.log("Already posted" + child.data.title)
            })
            if(postObject.imageUrl === undefined){
                console.log("undefined " + lastId)
                startTweeting(lastId)
            }
            downloadImage(postObject, tweetImage)
        })
        .catch((err) => {
            console.log(err)
        })
    },3600000) //post every hour
}
startTweeting()