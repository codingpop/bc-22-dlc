import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/user';


const localStrategy = passportLocal.Strategy;
const router = express.Router();


router.get('/', (req, res) => {
  res.render('login', { title: 'Log in' });
});

passport.serializeUser((user, done) => {
  done(null, user._id)
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) =>{
    done(err, user);
  });
});

router.post('/', passport.authenticate('local', {failureRedirect: '/', failureFlash: 'Wrong User name and password'}, (req, res) => {
  req.flash('success', 'You are now Log in');
  res.redirect('/');
}));

passport.use(new localStrategy(
  (email, password, done) => {
    User.getUserByEmail(email, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) return done(err); 
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid Password');
          return done(null, false, { message: 'Invalid Password' });
        }
      });
    });
  }
));

module.exports = router;
