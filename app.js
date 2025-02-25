var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const bodyParser = require('body-parser'); // Adicione isso

const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb = client.db('theowlhousewikidb').collection('postagem');
const postagemDAO = require('./postagemDAO');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var crudRouter = require('./routes/crud');

var app = express();

// Middleware para lidar com dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // Coloque isso antes das rotas
app.use(express.json()); // Para processar JSON no corpo da requisição


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/crud', crudRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
