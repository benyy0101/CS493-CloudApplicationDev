const router = require('express').Router();
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { ValidationError } = require('sequelize')
const Users = require('../models/users');
exports.router = router;
//exports.photos = photos;

const { generateAuthToken, requireAuthentication } = require('../lib/auth')

/*
 * Route to create a new photo.
 */
const Photos = require('../models/photos')

router.post('/', requireAuthentication, async function (req, res, next) {
  const userId = req.body.userid
  console.log("-----------hi",req.body.userid)
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  
  if ((data.admin != 1) && (req.user != userId)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    try{
      //console.log(req.body)
      //const set = await Photos.sync({ force: true });
      const photos =  await Photos.create(req.body,[
        'userid','caption','reviewId','businessId'
      ])
      //console.log("Businesses: ", Businesses)
      console.log(" == Photos: ",photos.toJSON())
      res.status(201).send({id:photos.id})
    }
    catch(e){
      if( e instanceof ValidationError){
        res.status(400).send(
          {
            err:e.message
          }
        )
      }
      else{
        throw e   
      }
    }
  }
  
});

/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoID', async function (req, res, next) {
  const id = req.params.photoID
  // const busibesses = await Businesses.findAll({
  //   where: {id:id}
  // })
  const photos = await Photos.findByPk(id)
  if(photos){
    res.status(200).send(photos)
  }
  else{
    next()
  }
});
router.get('/', async function (req, res, next) {
  
  const photos = await Photos.findAll()
  if(photos){
    res.status(200).send(photos)
  }
  else{
    next()
  }
});

/*
 * Route to update a photo.
 */
router.put('/:photoID', requireAuthentication, async function (req, res, next) {
  const photoId = req.params.photoID
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const photo = await Photos.findOne({
    where:{
      id : photoId
    },
    raw:true
  })
  if ((data.admin != 1) && (photo.userid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    
  const result = await Photos.update(req.body,{
    where:{id:photoId},
    fields:[
      'userid',
      'caption',
      'reviewId',
      'businessId'
    ]
  })

  if (result[0]>0){
    res.status(204).send()
  }
  else{
    next()
  }
  }
});

/*
 * Route to delete a photo.
 */
router.delete('/:photoID',requireAuthentication, async function (req, res, next) {
  const photoId = req.params.photoID
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const photo = await Photos.findOne({
    where:{
      id : photoId
    },
    raw:true
  })
  if ((data.admin != 1) && (photo.userid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    const result = await Photos.destroy({ where: { id: photoId }})

    if (result >0){
      res.status(204).send()
    }
    else
    {
      next()
    }
  }
  
});
