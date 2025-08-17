const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Do not return password in queries
  },
  profileImage: {
    type: String,
    default: '',
  },
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
  collection: 'users'
});

module.exports = mongoose.model('user', userSchema);
