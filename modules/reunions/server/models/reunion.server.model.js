'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reunion Schema
 */
var ReunionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Veuillez remplir nom d\'Acheteur',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Veuillez remplir description',
    trim: true
  },
  time: {
    type: String,
    required: 'Veuillez remplir horaire'
  },
  date: {
    type: Date,
    required: 'Veuillez remplir description'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reunion', ReunionSchema);
