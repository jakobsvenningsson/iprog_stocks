/* jslint node: true */
"use strict";

module.exports = function(sequelize, Sequelize) {
  var Trade = sequelize.define('trades', {
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   name: {
     type: Sequelize.STRING
   },
   price: {
     type: Sequelize.DOUBLE
   },
   amount: {
     type: Sequelize.INTEGER
   },
   dt: {
     type: Sequelize.DATE
   },
   buyer: {
     type: Sequelize.STRING
   },
   seller: {
     type: Sequelize.STRING
   },
  },{
    timestamps: false
  });


  return Trade;
};
