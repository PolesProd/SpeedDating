(function () {
  'use strict';

  // Reunions controller
  angular
    .module('reunions')
    .controller('ReunionsController', ReunionsController);

  ReunionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'reunionResolve'];

  function ReunionsController ($scope, $state, $window, Authentication, reunion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reunion = reunion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Reunion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.reunion.$remove($state.go('reunions.list'));
      }
    }

    // Save Reunion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reunionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reunion._id) {
        vm.reunion.$update(successCallback, errorCallback);
      } else {
        vm.reunion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reunions.view', {
          reunionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
