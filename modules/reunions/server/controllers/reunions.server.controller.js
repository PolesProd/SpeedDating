'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reunion = mongoose.model('Reunion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Reunion
 */
exports.create = function(req, res) {
  var reunion = new Reunion(req.body);
  reunion.user = req.user;

  reunion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reunion);
    }
  });
};

/**
 * Show the current Reunion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var reunion = req.reunion ? req.reunion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  reunion.isCurrentUserOwner = req.user && reunion.user && reunion.user._id.toString() === req.user._id.toString();

  res.jsonp(reunion);
};

/**
 * Update a Reunion
 */
exports.update = function(req, res) {
  var reunion = req.reunion;

  reunion = _.extend(reunion, req.body);

  reunion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reunion);
    }
  });
};

/**
 * Delete an Reunion
 */
exports.delete = function(req, res) {
  var reunion = req.reunion;

  reunion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reunion);
    }
  });
};

/**
 * List of Reunions
 */
exports.list = function(req, res) {
  Reunion.find().sort('-created').populate('user', 'displayName').exec(function(err, reunions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reunions);
    }
  });
};

/**
 * Reunion middleware
 */
exports.reunionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reunion is invalid'
    });
  }

  Reunion.findById(id).populate('user', 'displayName').exec(function (err, reunion) {
    if (err) {
      return next(err);
    } else if (!reunion) {
      return res.status(404).send({
        message: 'No Reunion with that identifier has been found'
      });
    }
    req.reunion = reunion;
    next();
  });
};
