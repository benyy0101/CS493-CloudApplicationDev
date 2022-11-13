
const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')
const Businesses = require('./businesses')
const Reviews = require('./reviews')


const Photos = sequelize.define('photos',{
    userid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    caption:{
        type:DataTypes.STRING,
        allowNull:false
    }
  })


  Reviews.hasMany(Photos,{
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
    Businesses.hasMany(Photos,{
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  Photos.belongsTo(Reviews)
  Photos.belongsTo(Businesses)
  module.exports = Photos