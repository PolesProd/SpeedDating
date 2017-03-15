(function () {
  'use strict';

  angular
    .module('reunions')
    .controller('ReunionsListController', ReunionsListController);

  ReunionsListController.$inject = ['ReunionsService'];

  function ReunionsListController(ReunionsService) {
    var vm = this;

    vm.reunions = ReunionsService.query();
  }
}());
