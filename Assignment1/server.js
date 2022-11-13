const express = require('express')
const bp = require('body-parser')
const port = process.env.PORT || 8000
const app = express()

app.use(express.json())

var business = require('./business')
var review = require('./review')
var photo = require('./photo')

app.listen(port, function(){
    console.log("== Server is listening on port: ",port)
})


///Getting data///

app.get('/', function(req,res,next){
    res.status(200).send("Hello, world!")
})

app.get('/business', function(req, res, next){
    res.status(200).send(business)
})

app.get('/business/:id', function(req,res,next){
    const id = req.params.id;
    const review_filter = review.filter((review) => review.BusinessId == req.params.id)
    const photo_filter = photo.filter((photo) => photo.BusinessId == req.params.id)

    res.status(200).send({BusinessInfo:business[id-1], Reviews:review_filter, Photo:photo_filter})
})

app.get('/review', function(req,res,next){
    res.status(200).send(review)
})

app.get('/photo', function(req,res,next){
    res.status(200).send(photo)
})

///Posting data///

app.post('/business', function(req,res,next){
    const id = business.length +1;
    if(req.body 
        && req.body.Name 
        && req.body.Address
        && req.body.City
        && req.body.State
        && req.body.ZIP
        && req.body.Phone
        && req.body.Category
        && req.body.Subcategory){
            business.push({
                ID: id,
                Name: req.body.Name,
                Address: req.body.Address,
                City: req.body.City,
                State: req.body.State,
                ZIP: req.body.ZIP,
                Phone: req.body.Phone,
                Category: req.body.Category,
                Subcategory: req.body.Subcategory,
                Website: req.body.Website,
                Email: req.body.Email
            })
            res.status(201).send({
                ID: id
            })
        }
    else{
        res.status(403).send({
            err: "Invalid Request: Json field does not match"
        })
    }
})

app.post('/review/:id', function(req,res,next){
    console.log("--req.body: ", req.body)

    const condition_check = review.filter((review)=> review.BusinessId ==req.params.id)

    if(condition_check.length == 0 && req.body.BusinessId == req.params.id){
        if(req.body && req.body.BusinessId && req.body.StarRating && req.body.PriceRating){
            review.push({
                BusinessId: req.body.BusinessId,
                StarRating: req.body.StarRating,
                PriceRating: req.body.PriceRating,
                WrittenReview: req.body.WrittenReview
            })
            res.status(201).send({
                status: "Review has been posted successfully"
            })
            
        }
        else{
            res.status(403).send({
                err: "Invalid Request: Json field does not match"
            })
        }
    }
    else{
        res.status(403).send({
            err: "You have already posted a review of this company"
        })
    }
    
})

app.post('/photo/:id', function(req,res,next){
    console.log("== req.body:", req.body)
    if(req.body && req.body.BusinessId && req.body.Photo && req.body.Caption){
        photo.push({
            BusinessId: req.params.id,
            Photo: req.body.Photo,
            Caption: req.body.Caption
        })
        res.status(201).send({
            status: "Photo has been posted successfully"
        })
    }
    else{
        res.status(403).send({
            err: "Invalid Request: Json field does not match"
        })
    }
})


////Updating data////

app.put('/business/:id',function(req,res,next){

    const id = req.params.id

    if(req.body.ID == business[id-1].ID){
        if (req.body && req.body.Name && req.body.Address&& req.body.City && req.body.State&& req.body.ZIP&& req.body.Phone&& req.body.Category&& req.body.Subcategory)
        {
            business[id-1] = req.body
            res.status(200).send({
                status: "Business updated successfully"
            })
        }
    }
    else{
        console.log("working")
        res.status(403).send({
            err: "Invalid Request: Json field does not match"
        })
    }

})

app.put('/review/:id', function(req,res,next){
    const rid = parseInt(req.params.rid)
    
    if(req.body && req.body.BusinessId && req.body.StarRating && req.body.PriceRating){
        review[rid] = req.body
        res.status(200).send({
            status: "Review updated successfully"
        })
    }
    else{
        res.status(403).send({
            err: "Invalid Request: Json field does not match"
        })
    }
})

app.put('/photo/:pid', function(req,res,next){
    const pid = parseInt(req.params.pid)

    if(req.body && req.body.BusinessId && req.body.Photo && req.body.Caption){
        photo[pid] = req.body
        res.status(200).send({
            status: "Photo updated successfully"
        })
    }
    else{
        res.status(403).send({
            err: "Invalid Request: Json field does not match"
        })
    }
})


////Deletion/////

app.delete('/business/:id', function(req,res,next){
    const id = parseInt(req.params.id)

    if(business[id]){
        business[id] = null
        console.log("hi")
        res.status(204).end()
    }
    else{
        res.status(403).send({
            error: "Business not found"
        })
    }
})

app.delete('/review/:id', function(req,res,next){
    const id = parseInt(req.params.id)

    if(review[id-1]){
        review[id-1] = null
        console.log("hi")
        res.status(204).end()
    }
    else{
        res.status(403).send({
            error: "Review not found"
        })
    }
})

app.delete('/photo/:id', function(req,res,next){
    const id = parseInt(req.params.id)

    if(photo[id]){
        photo[id] = null
        res.status(204).end()
    }

    else{
        res.status(403).send({
            error: "Photo not found"
        })
    }
})


app.use(function (req, res, next) {
    console.log("== Request received")
    console.log("  - METHOD:", req.method)
    console.log("  - URL:", req.url)
    console.log("  - HEADERS:", req.headers)
    next()
})

app.use('*', function(req,res,next){
    res.status(404).send(
        {
            err:"This url is not recognized: "+req.originalUrl
        }
    )
})




//app.post()
//app.put()
//app.delete()
//app.patch()
