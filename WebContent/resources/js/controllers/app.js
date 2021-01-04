// When defining a module with no module dependencies,
// the array of dependencies should be defined and empty.
    var design_Tool_App = angular.module('design_Tool_App', ['ngRoute']);
    

    
    // configure our routes
    design_Tool_App.config(['$routeProvider',function($routeProvider) {
        $routeProvider
			.when('/', {
			    templateUrl : 'resources/pages/home.html'
			})
            // route for the home page
            .when('/home', {
                templateUrl : 'resources/pages/home.html'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'resources/pages/aboutus.html'
            })

            // route for the visual inspection page
            .when('/visualinspection', {
                templateUrl : 'resources/pages/visualinspection.html'
            })
            
            // route for the choice reaction time page
            .when('/choicereactiontime', {
                templateUrl : 'resources/pages/choicereactiontime.html'
            })
            
            // route for the fitts tapping page
            .when('/fittstapping', {
                templateUrl : 'resources/pages/fittstapping.html'
            })
            
            // route for the simple reaction time page
            .when('/simplereactiontime', {
                templateUrl : 'resources/pages/simplereactiontime.html'
            })
            
            // route for the learning curve page
            .when('/learningcurve', {
                templateUrl : 'resources/pages/learningcurve.html'
            })
            
            // route for the short term memory span page
            .when('/shorttermmemoryspan', {
                templateUrl : 'resources/pages/shorttermmemoryspan.html'
            })
            
            // route for the short term memory span page
            .when('/strooptest', {
                templateUrl : 'resources/pages/strooptest.html'
            })
            
			.otherwise('/home');

    }]);
    
    // create the controller and inject Angular's $scope
    design_Tool_App.controller('mainController', function() {
        
    });

/*    design_Tool_App.controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    design_Tool_App.controller('visualinspectionController', function($scope) {
        $scope.message = 'Look! I am visual inspection page.';
    });*/