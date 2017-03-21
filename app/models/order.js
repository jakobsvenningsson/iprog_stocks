/* jslint node: true */
"use strict";

module.exports = function(sequelize, Sequelize) {

  var Order = sequelize.define('orders', {
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   },
   name: {
     type: Sequelize.STRING
   },
   type: {
     type: Sequelize.STRING
   },
   price: {
     type: Sequelize.DOUBLE
   },
   amount: {
     type: Sequelize.INTEGER
   },
   uid: {
     type: Sequelize.STRING
   },
  },{
    timestamps: false
  });

  return Order;
};
