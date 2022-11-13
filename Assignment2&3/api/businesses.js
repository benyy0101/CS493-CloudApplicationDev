const router = require('express').Router();
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { ValidationError } = require('sequelize')
//const businesses = require('../data/businesses');
//const { reviews } = require('./reviews');
//const { photos } = require('./photos');
const Users = require('../models/users');
exports.router = router;
//exports.businesses = businesses;
const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Reviews = require('../models/reviews')
const Photos = require('../models/photos')


const Businesses = require('../models/businesses');
const { send } = require('express/lib/response');
const { generateAuthToken, requireAuthentication } = require('../lib/auth')

router.get('/', async function(req,res,next){
  let page = parseInt(req.query.page) || 1
  page = page < 1 ? 1 : page
  const pageSize = 10
  const offset = (page - 1) * pageSize

  const result = await Businesses.findAndCountAll({
    limit:pageSize,
    offset:offset
  })

  res.status(200).send({
    Businesses: result.rows,
    page:page,
    pageSize:pageSize,
    count: result.count,
    totalPages: Math.ceil(result.count/pageSize)
  })
})

router.get('/:id', async function(req,res,next){
  const id = req.params.id
  // const busibesses = await Businesses.findAll({
  //   where: {id:id}
  // })
  const busibesses = await Businesses.findByPk(id,{
    include:[
      {model:Reviews},
      {model:Photos}
    ] 
  })
  if(busibesses){
    res.status(200).send(busibesses)
  }
  else{
    next()
  }
  
})

router.post('/', requireAuthentication,async function(req,res,next){
  const userId = req.body.ownerid
  console.log("-----------hi",req.body.ownerid)
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
      const bs =  await Businesses.create(req.body,[
        'ownerid','name','address','city','state','zip','phone','category','subcategory'
      ])
      //console.log("Businesses: ", Businesses)
      console.log(" == Businesses: ",bs.toJSON())
      res.status(201).send({id:bs.id})
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
})

router.put('/:businessId', requireAuthentication, async function(req,res,next){
  const businessId = req.params.businessId
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const business = await Businesses.findOne({
    where:{

      id : businessId
    },
    raw:true
  })
  if ((data.admin != 1) && (business.ownerid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    const result = await Businesses.update(req.body,{
      where:{id: businessId},
      fields:[
        'ownerid',
        'name',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'category',
        'subcategory'
      ]
    })
  
    if (result[0]>0){
      res.status(204).send()
    }
    else{
      next()
    }
  }
})

router.delete('/:businessId', requireAuthentication,async function(req,res,next){
  const BID = req.params.businessId

  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  const business = await Businesses.findOne({
    where:{

      id : BID
    },
    raw:true
  })

  if ((data.admin != 1) && (business.ownerid != req.user)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    const result = await Businesses.destroy({ where: { id: BID }})

  if (result >0){
    res.status(204).send()
  }
  else
  {
    next()
  }
  }

})
