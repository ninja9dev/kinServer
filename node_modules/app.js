var express = require('express'),
  app = express(),
  // var http = require('http').Server(app);
  // var io = require('socket.io')(http),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  users = require('./api/models/userModel'), 
  admin = require('./api/models/adminModel'), 
  cmspage = require('./api/models/cmspageModel'),
  store = require('./api/models/storeModel'),
  point = require('./api/models/pointModel'),
  newsfeed = require('./api/models/newsfeedModel'),
  Product = require('./api/models/productModel'), 
  bodyParser = require('body-parser'),
  Category = require('./api/models/categoryModel'), 
  group = require('./api/models/groupModel'), 
  chat = require('./api/models/chatModel'), 
  multer  = require('multer');
 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hats'); 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});


var path = __dirname;

path = path.split('/server');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', port);


var routes = require('./api/routes/mobileAppRoute');
  routes(app);
var webroutes = require('./api/routes/webRoutes');
  webroutes(app);
app.use('/images', express.static(path[0] + '/images'));
app.listen(port);
module.exports = app;
console.log('todo list RESTful API server started on: ' + port);
