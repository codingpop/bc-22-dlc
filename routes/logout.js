import express from 'express';
import passport from 'passport';

const app = express();


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = app;



