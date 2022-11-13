/*
 * Photo schema and data accessor methods.
 */
const fs = require('fs')
const { ObjectId,GridFSBucket } = require('mongodb')
const crypto = require('crypto')
const { getDbReference } = require('../lib/mongo')
const { extractValidFields } = require('../lib/validation')

const Jimp = require('jimp')
const { path } = require('express/lib/application')
/*
 * Schema describing required/optional fields of a photo object.
 */
const PhotoSchema = {
  businessId: { required: true },
  caption: { required: false }
}
exports.PhotoSchema = PhotoSchema



async function saveImageFile(photos){
  return new Promise(function (resolve, reject) {
    const db = getDbReference()
    const bucket = new GridFSBucket(db, { bucketName: 'photos' })
    const metadata = {
      businessId: photos.businessId,
      caption: photos.caption,
      
    }
    const uploadStream = bucket.openUploadStream(photos.filename, {
      metadata: metadata
    })

    fs.createReadStream(photos.path).pipe(uploadStream)
      .on('error', function (err) {
        reject(err)
      })
      .on('finish', function (result) {
        console.log("== stream result:", result)
        resolve(result._id)
      })
  })
}
exports.saveImageFile = saveImageFile
/*
 * Executes a DB query to insert a new photo into the database.  Returns
 * a Promise that resolves to the ID of the newly-created photo entry.
 */
async function insertNewPhoto(photo) {
  // photo = extractValidFields(photo, PhotoSchema)
  // photo.businessId = ObjectId(photo.businessId)
  const db = getDbReference()
  const collection = db.collection('photos')
  const result = await collection.insertOne(photo)
  return result.insertedId
}
exports.insertNewPhoto = insertNewPhoto

/*
 * Executes a DB query to fetch a single specified photo based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * photo.  If no photo with the specified ID exists, the returned Promise
 * will resolve to null.
 */
async function getPhotoById(id) {
  const db = getDbReference()
  //const collection = db.collection('photos')
  const bucket = new GridFSBucket(db, { bucketName: 'photos' })
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getPhotoById = getPhotoById

exports.getImageDownloadStream = function(filename) {
  const db = getDbReference()
  const bucket = new GridFSBucket(db, { bucketName: 'photos' })
  return bucket.openDownloadStreamByName(filename)
}

exports.getDownloadStreamById = function (id) {
  const db = getDbReference()
  const bucket = new GridFSBucket(db, { bucketName: 'photos' })
  if (!ObjectId.isValid(id)) {
    return null
  } else {
    return bucket.openDownloadStream(new ObjectId(id))
  }
}

exports.createThumbnail = async (thumbnail) => {
  console.log(thumbnail)
  const filename = crypto.pseudoRandomBytes(16).toString('hex') +".png";
  const path = './uploads/' + filename
  const result = await Jimp.read(thumbnail)
  await result.resize(100,100)
  await result.writeAsync(path)
  console.log("THUMBNAIL CREATED")
  console.log(filename)

  return new Promise(function (resolve, reject) {
    const db = getDbReference()
    const bucket = new GridFSBucket(db, { bucketName: 'photos' })
    const metadata = {
      path: path,
      filename: filename
    }
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: metadata
    })
  
    fs.createReadStream(path).pipe(uploadStream)
      .on('error', function (err) {
        reject(err)
      })
      .on('finish', function (result) {
        console.log("== stream result:", result)
        resolve(result._id)
      })
  })
}

exports.updateInfoById = async function(photoId, thumbnailId){
  console.log("PPPPPPPPP",photoId)
  console.log("TTTTTTTT",thumbnailId)
  const db = getDbReference();
  const collection = db.collection('photos.files')
  
  const result = await collection.updateOne(
    {_id: new ObjectId(photoId)},
    {$set: {"thumbnailId": thumbnailId}}
  )

  return result.matchedCount > 0
}

exports.updateFileById = async function(photoId){

  const db = getDbReference();
  const collection = db.collection('photos.files')
  
  const result = await collection.updateOne(
    {_id: new ObjectId(photoId)},
    {$set: {"filename": photoId + ".png"}}
  )

  return result.matchedCount > 0
}

exports.findThumb = async function(filename){
  const db = getDbReference();
  const collection = db.collection('photos.files')

  const result = await collection.findOne(
    {filename: filename}
  )
  console.log("RESULT--------", result._id)
  console.log("RESULT--------", result.thumbnailId)
  const result1 = await collection.findOne(
    {_id: new ObjectId(result.thumbnailId)}
  )

  console.log("RESULT--------", result1.filename)
  return result1
}