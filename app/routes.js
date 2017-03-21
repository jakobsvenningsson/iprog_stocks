/* jslint node: true */
"use strict";

module.exports = function(io, sequelize, Sequelize){

var express = require('express');
var router = express.Router();

var controller = require('./controller.js')(io, sequelize, Sequelize);

router.post('/security/submit', controller.submitSecurity);

router.post('/order/submit', controller.submitOrder);

router.get('/orders/:security', controller.getOrders);

router.get('/securities', controller.getSecurities);

router.get('/trades/:security', controller.getTrades);

return router;

};
