(function () {
  'use strict';

  angular
    .module('appointments.admin')
    .controller('AppointmentsAdminController', AppointmentsAdminController);

  AppointmentsAdminController.$inject = ['$scope', '$state', '$window', 'appointmentResolve', 'Authentication', 'Notification'];

  function AppointmentsAdminController($scope, $state, $window, appointment, Authentication, Notification) {
    var vm = this;

    vm.appointment = appointment;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing appointment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.appointment.$remove(function() {
          $state.go('admin.appointments.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> appointment deleted successfully!' });
        });
      }
    }

    // Save appointment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appointmentForm');
        return false;
      }

      // Create a new appointment, or update the current instance
      vm.appointment.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.appointments.list'); // should we send the User to the list or the updated appointment's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> appointment saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> appointment save error!' });
      }
    }
  }
}());
