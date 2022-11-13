/*
 * API sub-router for businesses collection endpoints.
 */
const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const { connectToRabbitMQ, getChannel } = require('../lib/rabbitmq')
const { Router } = require('express')

const { validateAgainstSchema } = require('../lib/validation')
const {
  PhotoSchema,
  saveImageFile,
  insertNewPhoto,
  getPhotoById,
  updateFileById
} = require('../models/photo')
const queue = 'photos'
const router = Router()

const fileTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
}

const upload = multer({ 
  storage: multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, callback) {
      console.log(file)
      const ext = fileTypes[file.mimetype]
      const filename = file._id
      callback(null, `${filename}.${ext}`)
    }
  }),
  fileFilter: function (req, file, callback) {
    callback(null, !!fileTypes[file.mimetype])
  }
 })

/*
 * POST /photos - Route to create a new photo.
 */
router.post('/',  upload.single('image'), async (req, res) => {
  if (req.file && req.body && req.body.businessId) {
    const photo = {
      businessId:req.body.businessId,
      caption:req.body.caption,
      path: req.file.path,
      filename: req.file._id,
      thumbnailId:" "
    }
    // const id = await saveImageInfo(image)
    const id = await saveImageFile(photo)
    const result = await updateFileById(id)
    const channel = getChannel()
    channel.sendToQueue(queue, Buffer.from(id.toString()))
    res.status(200).send({ id: id })
  } else {
    res.status(400).send({
      err: 'Request body needs an "image" and a "userId"'
    })
  }

 
})

/*
 * GET /photos/{id} - Route to fetch info about a specific photo.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const photo = await getPhotoById(req.params.id)
    if (photo) {
      const resBody = {
        _id: photo._id,
        url: `/media/photos/${photo.filename}`,
        businessId: photo.metadata.businessId,
        caption: photo.metadata.caption,
        thumbnailId: photo.thumbnailId,
        filename: photo.filename
      }
      photo.url = `/media/photos/${photo.filename}`
      res.status(200).send(resBody)
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({
      error: "Unable to fetch photo.  Please try again later."
    })
  }
})

//router.use('/', express.static(`${__dirname}/uploads`))
module.exports = router
