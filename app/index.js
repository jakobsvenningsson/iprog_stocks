var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var sharedSession = require('express-socket.io-session');
var expressSession = require('express-session');


var port = 8080;

var app = express();
app.use(express.static(__dirname + '/../public'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var session = expressSession({
    secret: "MoveFromHereOrTheSecretWillBeOnGit",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedSession(session));

var s = require('./sequelize.js');

app.use('/API', require('./routes.js')(io, s.sequelize ,s.Sequelize));

var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  console.log("new connection SOCKET");
  socketController(socket, io);
});

httpServer.listen(port, function () {
  console.log("server listening on port", port);
});
