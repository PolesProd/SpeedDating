(function (app) {
  'use strict';

  app.registerModule('appointments');
  app.registerModule('appointment', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('appointment.admin', ['core.admin']);
  app.registerModule('appointment.admin.routes', ['core.admin.routes']);
  app.registerModule('appointment.services');
  app.registerModule('appointment.routes', ['ui.router', 'core.routes', 'appointment.services']);
}(ApplicationConfiguration));
