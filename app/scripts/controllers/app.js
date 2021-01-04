// When defining a module with no module dependencies,
// the array of dependencies should be defined and empty.
    var design_Tool_App = angular.module('design_Tool_App', ['ngRoute']);
    

    
    // configure our routes
    design_Tool_App.config(['$routeProvider',function($routeProvider) {
        $routeProvider
			.when('/', {
			    templateUrl : 'app/views/home.html'
			})
            // route for the home page
            .when('/home', {
                templateUrl : 'app/views/home.html'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'app/views/aboutus.html'
            })

            // route for the visual inspection page
            .when('/visualinspection', {
                templateUrl : 'app/views/visualinspection.html'
            })
            
            // route for the choice reaction time page
            .when('/choicereactiontime', {
                templateUrl : 'app/views/choicereactiontime.html'
            })
            
            // route for the fitts tapping page
            .when('/fittstapping', {
                templateUrl : 'app/views/fittstapping.html'
            })
            
            // route for the simple reaction time page
            .when('/simplereactiontime', {
                templateUrl : 'app/views/simplereactiontime.html'
            })
            
            // route for the learning curve page
            .when('/learningcurve', {
                templateUrl : 'app/views/learningcurve.html'
            })
            
            // route for the short term memory span page
            .when('/shorttermmemoryspan', {
                templateUrl : 'app/views/shorttermmemoryspan.html'
            })
            
            // route for the short term memory span page
            .when('/strooptest', {
                templateUrl : 'app/views/strooptest.html'
            })
            
			.otherwise('/home');

    }]);
    
    // create the controller and inject Angular's $scope
    design_Tool_App.controller('mainController', function() {
        
    });
