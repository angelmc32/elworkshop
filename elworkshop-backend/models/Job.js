const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const jobSchema = new Schema(
  {
    worker: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Worker'
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    hourly_rate: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model('Job', jobSchema);