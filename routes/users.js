import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/user';
import Student from '../models/student';
import Instructor from '../models/instructor';


const localStrategy = passportLocal.Strategy;
const router = express.Router();

/* GET users listing. */
router.get('/signup', (req, res) => {
  res.render('signup');
});-

router.post('/signup', (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  // form validation
  req.checkBody('first_name', 'First name field is required').notEmpty();
  req.checkBody('last_name', 'Last name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'passwords do not match').equals(req.body.password);

// check for errors
const errors = req.validationErrors();
if(errors){
  res.render('signup', {
    errors,
    first_name,
    last_name,
    email,
    username,
    password,
    password2
  });
} else {
  const newUser = new User({
    email,
    username,
    password,
    role: 'student'
  });
  const newStudent = new Student({
    first_name,
    last_name,
    email,
    username
  });
  User.saveStudent(newUser, newStudent, () => {
    console.log('student created');
  });
  
  req.flash('success', 'User added');
  res.redirect('/dashboard');
}

});

passport.serializeUser((user, done) => {
  done(null, user._id)
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) =>{
    done(err, user);
  });
});

router.post('/signin', passport.authenticate('local', {failureRedirect: '/', failureFlash: 'Wrong User name and password'}, (req, res) => {
  req.flash('success', 'You are now Log in');
  res.redirect('/');
}));

passport.use(new localStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if(!user){
        return done(null, false, {message: `Unknown User $(username)` });
      }
      
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) return done(err); 
        if (isMatch){
          return done(null, user)
        } else {
          console.log('Invalid Password');
          return done(null, false, {message : 'Invalid Password'});
        }

      });
    });
  }
));



module.exports = router;
