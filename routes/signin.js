import express from 'express';
import passport from 'passport';

const app = express();

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });


module.exports = app;
