import express from 'express';
import passport from 'passport';

const app = express();

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin' }));

// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });


module.exports = app;
