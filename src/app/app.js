var rsvpApp = angular.module('rsvpApp', ['ui.router','angularUtils.directives.dirPagination']);
rsvpApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/",
      templateUrl: "app/partials/login.html",
      controller: function($scope,$location) {
        $scope.submitForm = function(isValid) {
          // check to make sure the form is completely valid
          if (isValid) { 
            $location.path('/dashboard')
          }

        };
      }
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "app/partials/dashboard.html",
    })
    .state('group', {
      url: "/group",
      templateUrl: "app/partials/group.html",
    })
      .state('group.add-broker', {
        url: "/add-broker",
        templateUrl: "app/partials/group.add-broker.html",
        controller: 'group.addBrokerCtrl'
      })
      .state('group.show-broker', {
        url: "/show-broker",
        templateUrl: "app/partials/group.show-broker.html",
        controller: 'group.showBrokerCtrl',
        resolve: {
          brokersList: function(){
            return [
              {
                "id" : 1,
                "brokername" : "Ezra",
                "brokercompany" : "Company Name A",
                "brokeremail" : "Ezra.gmail.com",
                "brokerpercentage" : 10
              },
              {
                "id" : 2,
                "brokername" : "Atticus",
                "brokercompany" : "Company Name B",
                "brokeremail" : "Atticus.gmail.com",
                "brokerpercentage" : 20
              },
              {
                "id" : 3,
                "brokername" : "Asher",
                "brokercompany" : "Company Name C",
                "brokeremail" : "Asher.gmail.com",
                "brokerpercentage" : 10
              },
              {
                "id" : 4,
                "brokername" : "Declan",
                "brokercompany" : "Company Name D",
                "brokeremail" : "Declan.gmail.com",
                "brokerpercentage" : 5
              },
              {
                "id" : 5,
                "brokername" : "Oliver",
                "brokercompany" : "Company Name E",
                "brokeremail" : "Oliver.gmail.com",
                "brokerpercentage" : 10
              },
              {
                "id" : 6,
                "brokername" : "Ezra",
                "brokercompany" : "Company Name A",
                "brokeremail" : "Ezra.gmail.com",
                "brokerpercentage" : 10
              },
              {
                "id" : 7,
                "brokername" : "Atticus",
                "brokercompany" : "Company Name B",
                "brokeremail" : "Atticus.gmail.com",
                "brokerpercentage" : 20
              },
              {
                "id" : 8,
                "brokername" : "Asher",
                "brokercompany" : "Company Name C",
                "brokeremail" : "Asher.gmail.com",
                "brokerpercentage" : 10
              },
              {
                "id" : 9,
                "brokername" : "Declan",
                "brokercompany" : "Company Name D",
                "brokeremail" : "Declan.gmail.com",
                "brokerpercentage" : 5
              },
              {
                "id" : 10,
                "brokername" : "Oliver",
                "brokercompany" : "Company Name E",
                "brokeremail" : "Oliver.gmail.com",
                "brokerpercentage" : 10
              }
            ];
          }
        }
      })
      .state('group.add-user', {
        url: "/add-user",
        templateUrl: "app/partials/group.add-user.html",
        controller: 'group.addUserCtrl',
      })
      .state('group.show-user', {
        url: "/show-user",
        templateUrl: "app/partials/group.show-user.html",
        controller: 'group.showUserCtrl',
        resolve: {
          usersList: function(){
            return [
              {
                "id" : 1,
                "username" : "Ezra",
                "useremail" : "Ezra.gmail.com"
              },
              {
                "id" : 2,
                "username" : "Atticus",
                "useremail" : "Atticus.gmail.com"
              },
              {
                "id" : 3,
                "username" : "Asher",
                "useremail" : "Asher.gmail.com"
              },
              {
                "id" : 4,
                "username" : "Declan",
                "useremail" : "Declan.gmail.com"
              },
              {
                "id" : 5,
                "username" : "Oliver",
                "useremail" : "Oliver.gmail.com"
              },
              {
                "id" : 6,
                "username" : "Ezra",
                "useremail" : "Ezra.gmail.com"
              },
              {
                "id" : 7,
                "username" : "Atticus",
                "useremail" : "Atticus.gmail.com"
              },
              {
                "id" : 8,
                "username" : "Asher",
                "useremail" : "Asher.gmail.com"
              },
              {
                "id" : 9,
                "username" : "Declan",
                "useremail" : "Declan.gmail.com"
              },
              {
                "id" : 10,
                "username" : "Oliver",
                "useremail" : "Oliver.gmail.com"
              }
            ];
          }
        }
      })
    .state('place', {
      url: "/place",
      templateUrl: "app/partials/place.html",
    })
      .state('place.add-state', {
        url: "/add-state",
        templateUrl: "app/partials/place.add-state.html",
        controller: 'place.addStateCtrl'
      })
      .state('place.show-state', {
        url: "/show-state",
        templateUrl: "app/partials/place.show-state.html",
        controller: 'place.showStateCtrl'
      })
      .state('place.add-region', {
        url: "/add-region",
        templateUrl: "app/partials/place.add-region.html",
        controller: 'place.addRegionCtrl',
      })
      .state('place.show-region', {
        url: "/show-region",
        templateUrl: "app/partials/place.show-region.html",
        controller: 'place.showRegionCtrl'
      })
      .state('place.add-hotel', {
        url: "/add-hotel",
        templateUrl: "app/partials/place.add-hotel.html",
        controller: 'place.addHotelCtrl'
      })
      .state('place.show-hotel', {
        url: "/show-hotel",
        templateUrl: "app/partials/place.show-hotel.html",
        controller: 'place.showHotelCtrl'
      })
      .state('place.add-room-type', {
        url: "/add-room-type",
        templateUrl: "app/partials/place.add-room-type.html",
        controller: 'place.addRoomTypeCtrl'
      })
      .state('place.show-room-type', {
        url: "/show-room-type",
        templateUrl: "app/partials/place.show-room-type.html",
        controller: 'place.showRoomTypeCtrl'
      })
    ;
});