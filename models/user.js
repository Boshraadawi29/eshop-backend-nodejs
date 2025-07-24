const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a full name'],
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  zip: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJson', {  
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    //   delete ret.password;
  },
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
  