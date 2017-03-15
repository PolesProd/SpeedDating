(function () {
  'use strict';

  describe('Reunions Controller Tests', function () {
    // Initialize global variables
    var ReunionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReunionsService,
      mockReunion;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReunionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReunionsService = _ReunionsService_;

      // create mock Reunion
      mockReunion = new ReunionsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Reunion Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Reunions controller.
      ReunionsController = $controller('ReunionsController as vm', {
        $scope: $scope,
        reunionResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleReunionPostData;

      beforeEach(function () {
        // Create a sample Reunion object
        sampleReunionPostData = new ReunionsService({
          name: 'Reunion Name'
        });

        $scope.vm.reunion = sampleReunionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ReunionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/reunions', sampleReunionPostData).respond(mockReunion);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Reunion was created
        expect($state.go).toHaveBeenCalledWith('reunions.view', {
          reunionId: mockReunion._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/reunions', sampleReunionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Reunion in $scope
        $scope.vm.reunion = mockReunion;
      });

      it('should update a valid Reunion', inject(function (ReunionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/reunions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('reunions.view', {
          reunionId: mockReunion._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ReunionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/reunions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Reunions
        $scope.vm.reunion = mockReunion;
      });

      it('should delete the Reunion and redirect to Reunions', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/reunions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('reunions.list');
      });

      it('should should not delete the Reunion and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
