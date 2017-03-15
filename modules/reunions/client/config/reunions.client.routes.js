(function () {
  'use strict';

  angular
    .module('reunions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reunions', {
        abstract: true,
        url: '/reunions',
        template: '<ui-view/>'
      })
      .state('reunions.list', {
        url: '',
        templateUrl: 'modules/reunions/client/views/list-reunions.client.view.html',
        controller: 'ReunionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reunions List'
        }
      })
      .state('reunions.create', {
        url: '/create',
        templateUrl: 'modules/reunions/client/views/form-reunion.client.view.html',
        controller: 'ReunionsController',
        controllerAs: 'vm',
        resolve: {
          reunionResolve: newReunion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Reunions Create'
        }
      })
      .state('reunions.edit', {
        url: '/:reunionId/edit',
        templateUrl: 'modules/reunions/client/views/form-reunion.client.view.html',
        controller: 'ReunionsController',
        controllerAs: 'vm',
        resolve: {
          reunionResolve: getReunion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Reunion {{ reunionResolve.name }}'
        }
      })
      .state('reunions.view', {
        url: '/:reunionId',
        templateUrl: 'modules/reunions/client/views/view-reunion.client.view.html',
        controller: 'ReunionsController',
        controllerAs: 'vm',
        resolve: {
          reunionResolve: getReunion
        },
        data: {
          pageTitle: 'Reunion {{ reunionResolve.name }}'
        }
      });
  }

  getReunion.$inject = ['$stateParams', 'ReunionsService'];

  function getReunion($stateParams, ReunionsService) {
    return ReunionsService.get({
      reunionId: $stateParams.reunionId
    }).$promise;
  }

  newReunion.$inject = ['ReunionsService'];

  function newReunion(ReunionsService) {
    return new ReunionsService();
  }
}());
