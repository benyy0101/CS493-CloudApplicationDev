const router = require('express').Router();
const bcrypt = require('bcryptjs')
const { ValidationError } = require('sequelize')
exports.router = router;
const jwt = require('jsonwebtoken')

const Reviews = require('../models/reviews')
const Photos = require('../models/photos')
const Businesses = require('../models/businesses');

const { generateAuthToken, requireAuthentication } = require('../lib/auth')


const Users = require('../models/users');
const { send } = require('express/lib/response');

//Registering an user 
router.post('/', requireAuthentication, async function (req, res,next) {
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  //console.log("---",data.admin)
  //console.log("--",data)
  if(data.admin == false){
    res.status(403).send({
      err:"Only administors can register a new user"
    })
  }
  else{
    try{
      console.log(req.body)
      //const set = await Photos.sync({ force: true });
      const users =  await Users.create(req.body,[
        'name','email','password','admin'
      ])
      
      res.status(201).send({id:users.id})
  
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
        console.log("-----------------------hi")
        throw e   
      }
    }
  }
})


//user login
router.post('/login',async function(req,res,next){
  if (req.body && req.body.id && req.body.password) {
    const userId = parseInt(req.body.id);
    const user = await Users.findOne({
      where:{
        id: userId
      },
      raw: true
    })
    console.log("-----------------------",user.admin)
    console.log("-----------------------",typeof(user.password))
    //const password1 = user.password
    const authenticated = user && await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (authenticated) {
        const token = generateAuthToken(req.body.id)
        
        res.status(200).send({ token: token })
    } else {
        res.status(401).send({
            error: "Invalid credentials"
        })
    }
} else {
    res.status(400).send({
        error: "Request needs user ID and password."
    })
}
})

router.get('/:userid',requireAuthentication, async function (req, res, next) {
  const userId = parseInt(req.params.userid);
  //console.log(req.user)
  //console.log(userId)
  //console.log(req.admin)
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  console.log(data.admin)
  if ((data.admin != 1) && (req.user != userId)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    try {
      const data = await Users.findAll({
        where: {
          id : userId
        }
      }
  
      );
      if(data) {
        res.status(200).send(data);
      } else {
        next();
      }    
  } catch (err) {
    res.status(500).send({
      error: "Unable to fetch User data." + err
    });
  }  
  }
});

router.get('/:userid/businesses',requireAuthentication, async function (req, res) {
  const userId = parseInt(req.params.userid);
  //console.log(req.user)
  //console.log(userId)
  //console.log(req.admin)
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  console.log(data.admin)
  if ((data.admin != 1) && (req.user != userId)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    try {
      const business = await Businesses.findAll({
        where: {
          ownerid : userId
        }
      }
  
      );
      if(business) {
        res.status(200).send(business);
      } else {
        next();
      }    
  } catch (err) {
    res.status(500).send({
      error: "Unable to fetch business. " + err
    });
  }  
  }  
});
/*
 * Route to list all of a user's reviews.
 */
router.get('/:userid/reviews',requireAuthentication, async function (req, res) {
  const userId = parseInt(req.params.userid);
  //console.log(req.user)
  //console.log(userId)
  //console.log(req.admin)
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  console.log(data.admin)
  if ((data.admin != 1) && (req.user != userId)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{
    try {
      const reviews = await Reviews.findAll({
        where: {
          userid : userId
        }
      }
      );

      if(data) {
        res.status(200).send(reviews);
      } else {
        next();
      }
    }       
    catch (err) {
      res.status(500).send({
        error: "Unable to fetch review data." + err
      });
    } 
  }
     
  }
);

/*
 * Route to list all of a user's photos.
 */
router.get('/:userid/photos',requireAuthentication, async function (req, res) {
  const userId = parseInt(req.params.userid);
  //console.log(req.user)
  //console.log(userId)
  //console.log(req.admin)
  const data = await Users.findOne({
    where: {
      id : req.user
    },
    raw: true
  })
  console.log(data.admin)
  if ((data.admin != 1) && (req.user != userId)){
    res.status(403).send({
      err:"Unauthorized to access the specified resource"
    })
  }
  else{ 
    try {
      const photos = await Photos.findAll({
        where: {
          userid : userId
        }
      }
      );

      if(data) {
        res.status(200).send(photos);
      } else {
        next();
      }    
    } 
    catch (err) {
      res.status(500).send({
        error: "Unable to fetch photo data." + err
      });
    } 
  } 
  
});
