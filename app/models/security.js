/* jslint node: true */
"use strict";

module.exports = function(sequelize, Sequelize) {
  var Security = sequelize.define('securities', {
   name: {
     type: Sequelize.STRING
   },
   id: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
   }
  },{
    timestamps: false
  });

  return Security;
};
