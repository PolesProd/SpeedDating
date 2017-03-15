(function () {
  'use strict';

  describe('Reunions Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReunionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReunionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReunionsService = _ReunionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('reunions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reunions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ReunionsController,
          mockReunion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reunions.view');
          $templateCache.put('modules/reunions/client/views/view-reunion.client.view.html', '');

          // create mock Reunion
          mockReunion = new ReunionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reunion Name'
          });

          // Initialize Controller
          ReunionsController = $controller('ReunionsController as vm', {
            $scope: $scope,
            reunionResolve: mockReunion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reunionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reunionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reunionId: 1
          })).toEqual('/reunions/1');
        }));

        it('should attach an Reunion to the controller scope', function () {
          expect($scope.vm.reunion._id).toBe(mockReunion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/reunions/client/views/view-reunion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReunionsController,
          mockReunion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('reunions.create');
          $templateCache.put('modules/reunions/client/views/form-reunion.client.view.html', '');

          // create mock Reunion
          mockReunion = new ReunionsService();

          // Initialize Controller
          ReunionsController = $controller('ReunionsController as vm', {
            $scope: $scope,
            reunionResolve: mockReunion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reunionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/reunions/create');
        }));

        it('should attach an Reunion to the controller scope', function () {
          expect($scope.vm.reunion._id).toBe(mockReunion._id);
          expect($scope.vm.reunion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/reunions/client/views/form-reunion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReunionsController,
          mockReunion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('reunions.edit');
          $templateCache.put('modules/reunions/client/views/form-reunion.client.view.html', '');

          // create mock Reunion
          mockReunion = new ReunionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Reunion Name'
          });

          // Initialize Controller
          ReunionsController = $controller('ReunionsController as vm', {
            $scope: $scope,
            reunionResolve: mockReunion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reunionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reunionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reunionId: 1
          })).toEqual('/reunions/1/edit');
        }));

        it('should attach an Reunion to the controller scope', function () {
          expect($scope.vm.reunion._id).toBe(mockReunion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/reunions/client/views/form-reunion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
