// Appointments service used to communicate Appointments REST endpoints
(function () {
  'use strict';

  angular
    .module('appointments')
    .factory('AppointmentsService', AppointmentsService);

  AppointmentsService.$inject = ['$resource'];

  function AppointmentsService($resource) {
    var Appointment = $resource('api/appointments/:appointmentId', {
      appointmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Appointment.prototype, {
      createOrUpdate: function () {
        var appointment = this;
        return createOrUpdate(appointment);
      }
    });

    return Appointment;

    function createOrUpdate(appointment) {
      if (appointment._id) {
        return appointment.$update(onSuccess, onError);
      } else {
        return appointment.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(appointment) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
