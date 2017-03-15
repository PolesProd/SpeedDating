// reunions service used to communicate Reunions REST endpoints
(function () {
  'use strict';

  angular
    .module('reunions')
    .factory('ReunionsService', ReunionsService);

  ReunionsService.$inject = ['$resource', '$log'];

  function ReunionsService($resource, $log) {
    var Reunion = $resource('/api/reunions/:reunionId', {
      reunionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Reunion.prototype, {
      createOrUpdate: function () {
        var reunion = this;
        return createOrUpdate(reunion);
      }
    });

    return Reunion;

    function createOrUpdate(reunion) {
      if (reunion._id) {
        return reunion.$update(onSuccess, onError);
      } else {
        return reunion.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(reunion) {
        // Any required internal processing from inside the service, goes here.
        return reunion;
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
