const express = require('express')
const morgan = require('morgan')
const multer = require('multer')
const crypto = require('crypto')
const { connectToRabbitMQ, getChannel } = require('./lib/rabbitmq')
const api = require('./api')
const { connectToDb } = require('./lib/mongo')
const { getImageDownloadStream, findThumb } = require('./models/photo')
const queue = 'photos'

const app = express()
const port = process.env.PORT || 8080

const fileTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
}

/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'))

app.use(express.json())
app.use(express.static('public'))

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */


app.get('/media/photos/:filename', function (req, res, next) {
  console.log("PHOTOS------", req.params.filename)
  getImageDownloadStream(req.params.filename)
    .on('file', function (file) {
      console.log("1111111111")
      res.status(200).type("image/png")
    })
    .on('error', function (err) {
      if (err.code === 'ENOENT') {
        next()
      } else {
        next(err)
      }
    })
    .pipe(res)
})

app.get('/media/thumbs/:filename', async function (req, res, next) {
  console.log("---------------", req.params.filename)
  const thumb = await findThumb(req.params.filename)
  console.log("FILENAME-----", thumb.filename)
  getImageDownloadStream(thumb.filename)
    .on('file', function (file) {
      console.log("1111111111")
      res.status(200).type("image/png")
    })
    .on('error', function (err) {
      if (err.code === 'ENOENT') {
        next()
      } else {
        next(err)
      }
    })
    .pipe(res)
})
//app.use('/media/photos/', express.static(`./uploads`))

app.use('/', api)

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  })
})

connectToDb(async () => {
  await connectToRabbitMQ(queue)
  app.listen(port, function () {
    console.log("== Server is running on port", port)
  })
})
