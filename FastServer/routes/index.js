const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = express.Router();

apiRouter.use(bodyParser.json());

apiRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req,res,next) => {
    res.json('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.json('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.json('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.json('Deleting all dishes');
});

apiRouter.route('/:id')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req,res,next) => {
    res.json('Will send '+req.params.id+' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
    res.json('Cant be added');
})
.put((req, res, next) => {
    
    res.json('PUT operation will be done on '+req.params.id);
})
.delete((req, res, next) => {
    res.json('Deleting '+req.params.id);
});






module.exports = apiRouter;