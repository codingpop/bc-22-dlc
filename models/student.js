import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  first_name: {
    type: 'string'
  },
  last_name: {
    type: 'string'
  },
  username: {
    type: 'string'
  },
  address: [{
    street_address: {type: 'string'},
    city: {type: 'string'},
    state: {type: 'string'},
    zip: {type: 'string'}
  }],
  email: {
    type: 'string'
  },
  classes: [{
    class_id: { type: [ mongoose.Schema.Types.ObjectId]},
    class_title: {type: 'string'}
  }]
});

const Student = module.exports = mongoose.model('Student', studentSchema);
