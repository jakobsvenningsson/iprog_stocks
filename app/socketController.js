/* jslint node: true */
"use strict";

module.exports = function (socket, io) {
  socket.on('newTrade', function (req) {
    io.emit('newTrade', req);
  });
  socket.on('newOrder', function (req) {
    io.emit('newOrder', req);
  });
  socket.on('removeOrder',function(req){
    io.emit('removeOrder', req);
  });
  socket.on('updateOrder',function(req){
    console.log(req);
    io.emit('updateOrder', req);
  });

};
