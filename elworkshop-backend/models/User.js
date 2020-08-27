const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    zip_code: {
      type: Number
    },
    date_of_birth: {
      type: Date,
      required: true
    },
    profile_picture: {
      type: String,
      default: 'https://cdn2.iconfinder.com/data/icons/social-media-flat-line/70/user-512.png'
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    professions: {
      type: [String]
    },
    last_login: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);