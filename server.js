#!/usr/bin/env node

/**
 * Module dependencies.
 */
import express from 'express';
import validator from 'express-validator';
import session from 'express-session';
import bodyParser from 'body-parser';
import router from './routes/route';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(session({ secret: 'ssshhhhh' }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log('app runs');
});

app.use('/', router);
