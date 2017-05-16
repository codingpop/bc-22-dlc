import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
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
  role: {
    type: 'string'
  }

});

const User = module.exports = mongoose.model('User', userSchema);

// fetch user
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
  const query = { username };
  User.findOne(query, callback);
}

// save student
module.exports.saveStudent = (newUser, newStudent, callback) => {
  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    // set hash
    newUser.password = hash;
    console.log('student is being saved');
    async.parallel([newUser.save, newStudent.save], callback);
  })
}

// compare password
module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  })
}
