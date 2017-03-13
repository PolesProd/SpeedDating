(function () {
  'use strict';

  // Configuring the appointments Admin module
  angular
    .module('appointments.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage appointments',
      state: 'admin.appointments.list'
    });
  }
}());
