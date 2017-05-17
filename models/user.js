import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// mongoose.connect('mongodb://localhost/fastlearn');
// const conn = mongoose.connection;

const userSchema = mongoose.Schema({
  first_name: {
    type: 'string'
  },
  last_name: {
    type: 'string'
  },
  username: {
    type: 'string'
  },
  email: {
    type: 'string'
  },
  password: {
    type: 'string',
    bcrypt: true
  },
});

const User = module.exports = mongoose.model('User', userSchema);

// fetch user
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByEmail = (email, callback) => {
  const query = { email };
  User.findOne(query, callback);
};


// compare password
module.exports.comparePassword = ((candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
});
// save to database

module.exports.createUser = ((newUser, callback) => {
  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    newUser.password = hash;
    newUser.save(callback);
  });
});

