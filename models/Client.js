const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true,
  },
  trackingID: {
    type: String,
    required: true,
    trim: true,
  },
  from: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'on route',
    enum: ['on route', 'arrived'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Client', ClientSchema)