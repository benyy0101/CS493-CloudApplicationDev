const { connectToDb } = require('./lib/mongo')
const { connectToRabbitMQ, getChannel } = require('./lib/rabbitmq')

const sh = require('sharp')
const jm = require('jimp')

const queue = 'photos'
const { connectToDB } = require('./lib/mongo')

const { getImageDownloadStream, getDownloadStreamById, createThumbnail, updateInfoById } = require('./models/photo')

connectToDb(async () =>{
    await connectToRabbitMQ(queue)
    const channel = getChannel()

    channel.consume(queue, async function(msg){
        const id = msg.content.toString()
        const downloadStream = getDownloadStreamById(id)
        var thumbnailId = null
        //console.log(downloadStream)
        const imageData = []
        downloadStream.on('data',function(data){
            imageData.push(data)
            console.log("DATA PUSHED")
            
        })

        downloadStream.on('end', async function(){
            //console.log(imageData[0].metadata())
            
            const thumbnail = Buffer.concat(imageData)
            console.log("THUMBNAIL START")
            thumbnailId = await createThumbnail(thumbnail)
            updateInfoById(id, thumbnailId)
            //console.log("Thumbnail id: ",thumbnailId)
            
        })
        
        channel.ack(msg)
    })

    
})