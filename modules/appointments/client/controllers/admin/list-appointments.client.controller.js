(function () {
  'use strict';

  angular
    .module('appointments.admin')
    .controller('AppointmentsAdminListController', AppointmentsAdminListController);

  AppointmentsAdminListController.$inject = ['AppointmentsService'];

  function AppointmentsAdminListController(AppointmentsService) {
    var vm = this;

    vm.appointments = AppointmentsService.query();
  }
}());
