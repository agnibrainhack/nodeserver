var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./database_sync/operations');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const url = 'mongodb://localhost:27017/FastServer';
MongoClient.connect(url, (err, database) => {
  assert.equal(err, null);
  console.log('Connected correctly to the server');
  const collectiondb = database.db("api");
  const collection = "myapi";

  dboper.insertDocument(collectiondb, {name: "Agni",title: "Brainhack"},collection, (result) => {
          console.log("Inserted Document:\n", result.ops);

          dboper.findDocument(collectiondb, collection, (docs) => {
              console.log("Found Documents:\n", docs);

              dboper.updateDocument(collectiondb, {name: "Agni"}, {title: "Fuego"}, collection, (result) => {
                  console.log("Updated Document:\n", result.result);
                  
                  dboper.findDocument(collectiondb, collection, (docs)=>{
                      console.log("Found Documents:\n", docs);
                      collectiondb.dropCollection("myapi", (result) => {
                        console.log("Dropped Collection: ",result);
                      });

                  });



              });



          });
      });
});


module.exports = app;
