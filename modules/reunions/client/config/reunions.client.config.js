(function () {
  'use strict';

  angular
    .module('reunions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Reunions',
      state: 'reunions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reunions', {
      title: 'List Reunions',
      state: 'reunions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reunions', {
      title: 'Create Reunion',
      state: 'reunions.create',
      roles: ['user']
    });
  }
}());
