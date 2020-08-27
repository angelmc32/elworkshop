const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const workerSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
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
    phone_number: {
      type: Number,
      required: true,
      unique: true
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

module.exports = model('Worker', workerSchema);