import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import mongo from 'mongodb';
import mongoose from 'mongoose';
import index from './routes/index';
import signup from './routes/signup';
import signin from './routes/signin';
import async from 'async';

mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
const conn = mongoose.connection;

const localStrategy = passportLocal.Strategy;
dotenv.config();

const app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Makes the user object global in all views
app.get('*', (req, res, next) => {
  // put user into res.local for easy access from all templates
  res.locals.user = req.user || null;
  next();
});

// flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/signup', signup);
app.use('/signin', signin);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
