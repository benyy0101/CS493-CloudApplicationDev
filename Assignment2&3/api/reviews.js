const router = require('express').Router();
//const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { ValidationError } = require('sequelize');
const Photos = require('../models/photos');
//const reviews = require('../data/reviews');
const Users = require('../models/users');
exports.router = router;
//exports.reviews = reviews;
const { generateAuthToken, requireAuthentication } = require('../lib/auth')
const Reviews = require('../models/reviews')
/*
 * Route to create a new review.
 */
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
      //const set = await Reviews.sync({ force: true });
      const reviews =  await Reviews.create(req.body,[
        'userid','dollars','stars','review'
      ])
      //console.log("Businesses: ", Businesses)
      //console.log(" == reviews: ",reviews.toJSON())
      res.status(201).send({id:reviews.id})
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
 * Route to fetch info about a specific review.
 */
router.get('/:reviewId', async function (req, res, next) {
  const id = req.params.reviewId
  const reviews = await Reviews.findByPk(id,{
    include: Photos
  })
  if(reviews){
    res.status(200).send(reviews)
  }
  else{
    next()
  }
});

router.get('/', async function (req, res, next) {
  
  const reviews = await Reviews.findAll()
  if(reviews){
    res.status(200).send(reviews)
  }
  else{
    next()
  }
});

/*
 * Route to update a review.
 */
router.put('/:reviewID', requireAuthentication,async function (req, res, next) {
  const reviewId = req.params.reviewID
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const review = await Reviews.findOne({
    where:{
      id : reviewId
    },
    raw:true
  })
  if ((data.admin != 1) && (review.userid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    const result = await Reviews.update(req.body,{
      where:{id: reviewId},
      fields:[
        'userid',
        'dollars',
        'stars',
        'review',
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
 * Route to delete a review.
 */
router.delete('/:reviewID', requireAuthentication, async function (req, res, next) {
  const reviewId = req.params.reviewID
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const review = await Reviews.findOne({
    where:{
      id : reviewId
    },
    raw:true
  })
  if ((data.admin != 1) && (review.userid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    
  const result = await Reviews.destroy({ where: { id: reviewId }})

  if (result >0){
    res.status(204).send()
  }
  else
  {
    next()
  }
  }
  
});



