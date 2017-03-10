(function () {
  'use strict';

  angular
    .module('appointments')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Appointments',
      state: 'appointments',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'appointments', {
      title: 'List Appointments',
      state: 'appointments.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'appointments', {
      title: 'Create Appointment',
      state: 'appointments.create',
      roles: ['user']
    });
  }
}());
