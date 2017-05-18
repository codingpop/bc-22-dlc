import express from 'express';
import User from '../models/user';


const router = express.Router();

/* GET users listing. */

router.get('/', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/', (req, res) => {
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
  if (errors) {
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
      first_name,
      last_name,
      email,
      username,
      password,
    });
    console.log(newUser);

    User.createUser(newUser, (err, user) =>{
      if (err) throw err;
      console.log(user);
    });    
    req.flash('success', 'User added');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
