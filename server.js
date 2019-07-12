var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');


global.appRoot = path.resolve(__dirname);

mongoose.connect('mongodb://localhost/ManualAuth', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

 app.set('views', path.join(__dirname, 'views'));
 app.set('node_modules', path.join(__dirname, 'node_modules'));
app.set('view engine', 'ejs');	



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/node_modules'));
var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
//app.use(serveStatic(path.join(__dirname + "public" )));
//  app.use( express.static("/images",__dirname + "/images"));
//app.use( express.static(__dirname));


// listen on port 3000
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });




app.listen(5000, function () {
  console.log('Express app listening on port 3000');
});