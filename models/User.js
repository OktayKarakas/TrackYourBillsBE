const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [3, 'Name cannot be less than 3 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    minlength: [6, 'Email cannot be less than 6 characters'],
    maxlength: [255, 'Email cannot be more than 255 characters'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide an email'],
    minlength: [6, 'Password cannot be less than 6 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
    default: 'lastName',
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency'],
    trim: true,
    default: 'USD',
  },
})

module.exports = mongoose.model('User', UserSchema)
