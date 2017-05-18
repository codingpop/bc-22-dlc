import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import mongo from 'mongodb';
import mongoose from 'mongoose';
import User from './models/user';
import index from './routes/index';
import signup from './routes/signup';
import signin from './routes/signin';

mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
const conn = mongoose.connection;

const localStrategy = passportLocal.Strategy;
dotenv.config();

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
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

// app.configure('development', () => {
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// app.configure('production', () => {
//   app.use(express.errorHandler());
// });

// app.listen(app.get('port'), () => {
//   console.log(("Express server listening on port " + app.get('port')))
// });


module.exports = app;
