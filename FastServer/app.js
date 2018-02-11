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
MongoClient.connect(url).then((database) => {
  console.log('Connected correctly to the server');
  const collectiondb = database.db("api");
  const collection = "myapi";
  dboper.insertDocument(collectiondb, { name: "Vadonut", description: "Test"},
  collection)
  .then((result) => {
      console.log("Insert Document:\n", result.ops);

      return dboper.findDocument(collectiondb, collection);
  })
  .then((docs) => {
      console.log("Found Documents:\n", docs);

      return dboper.updateDocument(collectiondb, { name: "Vadonut" },
              { description: "Updated Test" }, collection);

  })
  .then((result) => {
      console.log("Updated Document:\n", result.result);

      return dboper.findDocument(collectiondb, collection);
  })
  .then((docs) => {
      console.log("Found Updated Documents:\n", docs);
                      
      return collectiondb.dropCollection(collection);
  })
  .then((result) => {
      console.log("Dropped Collection: ", result);

      return database.close();
  })
  .catch((err) => console.log(err));

})
.catch((err) => console.log(err));



const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./routes/models/genericModels');

const url2 = 'mongodb://localhost:27017/FastServer';
const connect = mongoose.connect(url2, {
    useMongoClient: true
});

connect.then((db) => {

    console.log('Connected correctly to server');

    var newDish = Dishes({
        name: 'Uthappizza',
        description: 'test'
    });

    newDish.save()
        .then((dish) => {
            console.log(dish);

            return Dishes.find({}).exec();
        })
        .then((dishes) => {
            console.log(dishes);

            return db.collection('dishes').drop();
        })
        .then(() => {
            return db.close();
        })
        .catch((err) => {
            console.log(err);
        });

});



module.exports = app;
