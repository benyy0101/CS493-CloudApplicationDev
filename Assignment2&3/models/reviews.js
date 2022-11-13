
const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Reviews = sequelize.define('reviews',{
    userid:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    dollars:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    stars:{
      type: DataTypes.FLOAT,
      allowNull:false
    },
    review:{
      type: DataTypes.STRING,
      allowNull:false
    }
  })

  module.exports = Reviews