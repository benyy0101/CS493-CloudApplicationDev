const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')
const bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(8);
const Users = sequelize.define('users',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        set(val){
            //console.log("type of this: ", bcrypt.hash(val))
            
            this.setDataValue('password',bcrypt.hashSync(val,salt).toString())
        }
    }
   ,
    admin:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
  })

  module.exports = Users