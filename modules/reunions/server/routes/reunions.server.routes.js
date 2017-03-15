'use strict';

/**
 * Module dependencies
 */
var reunionsPolicy = require('../policies/reunions.server.policy'),
  reunions = require('../controllers/reunions.server.controller');

module.exports = function(app) {
  // Reunions Routes
  app.route('/api/reunions').all(reunionsPolicy.isAllowed)
    .get(reunions.list)
    .post(reunions.create);

  app.route('/api/reunions/:reunionId').all(reunionsPolicy.isAllowed)
    .get(reunions.read)
    .put(reunions.update)
    .delete(reunions.delete);

  // Finish by binding the Reunion middleware
  app.param('reunionId', reunions.reunionByID);
};
