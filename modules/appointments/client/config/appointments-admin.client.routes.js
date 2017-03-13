(function () {
  'use strict';

  angular
    .module('appointments.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.appointments', {
        abstract: true,
        url: '/appointments',
        template: '<ui-view/>'
      })
      .state('admin.appointments.list', {
        url: '',
        templateUrl: '/modules/appointments/client/views/admin/list-appointments.client.view.html',
        controller: 'AppointmentsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.appointments.create', {
        url: '/create',
        templateUrl: '/modules/appointments/client/views/admin/form-Appointment.client.view.html',
        controller: 'AppointmentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          AppointmentResolve: newAppointment
        }
      })
      .state('admin.appointments.edit', {
        url: '/:AppointmentId/edit',
        templateUrl: '/modules/appointments/client/views/admin/form-Appointment.client.view.html',
        controller: 'AppointmentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          AppointmentResolve: getAppointment
        }
      });
  }

  getAppointment.$inject = ['$stateParams', 'AppointmentsService'];

  function getAppointment($stateParams, AppointmentsService) {
    return AppointmentsService.get({
      AppointmentId: $stateParams.AppointmentId
    }).$promise;
  }

  newAppointment.$inject = ['AppointmentsService'];

  function newAppointment(AppointmentsService) {
    return new AppointmentsService();
  }
}());
