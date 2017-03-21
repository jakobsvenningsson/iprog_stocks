/* jslint node: true */
"use strict";

module.exports = function(io, sequelize, Sequelize){

var orderModel = require('./models/order.js')(sequelize, Sequelize);
var securityModel = require('./models/security.js')(sequelize, Sequelize);
var tradeModel = require('./models/trade.js')(sequelize, Sequelize);

var controller = {};

controller.submitSecurity = function(req, res) {
  console.log(req.body.securityName);
  securityModel
    .create({name:req.body.securityName})
    .then(function(data){
      res.send(data.name);
    })
    .catch(function(err){
      res.send(err);
    });
};

controller.submitOrder = function(req, res) {
  securityModel.findAll({
      attributes:['name'],
      where: { name:req.body.name }
      })
      .then(function(res){
        if(res.length === 0){
          res.send("No securities called " + req.body.name + " exists.");
        } else {
          return orderModel.findAll({
            // Find all orders of the same securities but different type.
            // If the submitted order is of type sell then retrieve all orders of type buy etc.
            attributes:['id','name','price','amount','type','uid'],
            order: [['id', 'ASC']],
            where:{
                     name:req.body.name,
                     type:req.body.type === 'sell' ? 'buy' : 'sell',
                     price:req.body.price
                   }
            });
          }
        })
        .then(function(orders){
          // If there is any orders found, try to finalize transactions.
          var submitter = req.body;
          submitter.amount = Number(submitter.amount);

          orders.forEach(function(row){
              var tradeAmount = getTradeSize(submitter.amount, row.amount);
                if(tradeAmount  >= 0){
                  submitter.amount -= tradeAmount;
                  // Insert new trade in database
                  tradeModel.create({
                    name:row.name,
                    price:submitter.price,
                    amount:tradeAmount,
                    dt: new Date(),
                    buyer: submitter.type === 'buy' ? submitter.uid : row.uid,
                    seller: submitter.type === 'buy' ? row.uid : submitter.uid
                  })
                  .then(function(trade){
                    // Update websocket with new trade
                    io.emit('newTrade', trade);
                  });
                  // Update the modified order row
                  updateOrderRow(row, tradeAmount);
                }

              });
              if(submitter.amount > 0){
                orderModel.create({
                    name:submitter.name,
                    type:submitter.type,
                    price:submitter.price,
                    amount:submitter.amount,
                    uid: submitter.uid
                  })
                  .then(function(data){
                    io.emit("newOrder", data);
                  });
              }
        });
    res.send("Order submitted!");
};

controller.getOrders = function(req, res){
  orderModel.findAll({
    attributes:['id','name','price','amount','type','uid'],
    where:{name:req.params.security}
  })
  .then(function(data){
    res.json(data);
  });
};

controller.getSecurities = function(req, res){
  securityModel.findAll({
    attributes:['name']
  })
  .then(function(data){
    console.log(data);
    res.json(data);
  });
};

controller.getTrades = function(req,res){
  tradeModel.findAll({
    attributes:['id','name','price','amount','dt','buyer','seller'],
    where:{ name:req.params.security }
  })
  .then(function(data){
    res.json(data);
  });
};

function updateOrderRow(row, tradeAmount){
  if(row.amount - tradeAmount === 0){
      orderModel.destroy({
        where: {
          id: row.id
        }
      }).then(function(){
        io.emit('removeOrder', row.id);
      });
    }
    else if(row.amount - tradeAmount > 0){
      orderModel.update(
        {
          amount:(row.amount - tradeAmount)
        },
        {
          where:{id:row.id}                                        }
      ).then(function(){
        console.log(row);
        row.amount -= tradeAmount;
        io.emit('updateOrder', row);
      });
    }
}

function getTradeSize(buyer,seller){
  var count = 0;
  while(buyer > 0 && seller > 0){
    count++;
    buyer--;
    seller--;
  }
  return count;
}

  return controller;
};
