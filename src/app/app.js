var rsvpApp = angular.module('rsvpApp', [
  'ui.router',
  'angularUtils.directives.dirPagination',
  'ui.bootstrap',
  'ui.gravatar',
  'ngCookies',
  'gridshore.c3js.chart'
]);
rsvpApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$httpProvider,$locationProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  // For any unmatched url, redirect to /state1

  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/",
      templateUrl: "app/partials/login.html",
      controller: function($scope,$location,UserFactory,$rootScope,$cookies) {
        if($cookies.getObject('user') != null){
          $rootScope.user = $cookies.getObject('user');
          $location.path('/dashboard');
        }else{
          $location.path('/');
        }
        $scope.submitForm = function(isValid) {
          // check to make sure the form is completely valid
          if (isValid) {
            UserFactory.login($scope.user.email, $scope.user.password).then(function success(response) {
              $rootScope.user = {
                "_id"  : response.data.user._id,
                "name" : response.data.user.name,
                "email" : response.data.user.email,
                "type"  : response.data.user.type,
              }
              $cookies.putObject('user', $rootScope.user);
              $location.path('/dashboard');
            }, function(response){
              alert('Error: ' + response.data);
            });
          }

        };
      }
    })
    .state('logout', {
      url: "/logout",
      controller: function($scope,$location,UserFactory,$rootScope,$cookies) {
        UserFactory.logout();
        $rootScope.user = null;
        $cookies.remove('user');
        $location.path('/');
      }
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "app/partials/dashboard.html",
      controller: function($scope,$cookies,$rootScope,usersList,bookingList) {
        if($cookies.getObject('user') != null){
          $rootScope.user = $cookies.getObject('user');
        }else{
          $location.path('/');
        }
        total_booking = _.size(bookingList);

        $scope.category = [
          {name:'Corporate FIT – Contracted',value: _.size(_.where(bookingList,{"Category":'Corporate FIT – Contracted'}))},
          {name:'Corporate FIT – Non-Contracted',value: _.size(_.where(bookingList,{"Category":'Corporate FIT – Non-Contracted'}))},
          {name:'Leisure FIT',value: _.size(_.where(bookingList,{"Category":'Leisure FIT'}))},
          {name:'Govt FIT – Contracted',value: _.size(_.where(bookingList,{"Category":'Govt FIT – Contracted'}))},
          {name:'Govt FIT – Non-Contracted',value: _.size(_.where(bookingList,{"Category":'Govt FIT – Non-Contracted'}))},
          {name:'Meetings',value: _.size(_.where(bookingList,{"Category":'Meetings'}))},
          {name:'Conferences',value: _.size(_.where(bookingList,{"Category":'Conferences'}))},
          {name:'Exhibitions',value: _.size(_.where(bookingList,{"Category":'Exhibitions'}))},
          {name:'Dinner Event',value: _.size(_.where(bookingList,{"Category":'Dinner Event'}))},
          {name:'Lunch Event',value: _.size(_.where(bookingList,{"Category":'Lunch Event'}))},
          {name:'Breakfast Event',value: _.size(_.where(bookingList,{"Category":'Breakfast Event'}))},
          {name:'Weddings',value: _.size(_.where(bookingList,{"Category":'Weddings'}))},
        ];
        console.log(usersList);
        $scope.ub = [
          {name:'Users',value: _.size(_.where(usersList,{"type":'user'}))},
          {name:'Brokers',value: _.size(_.where(usersList,{"type":'broker'}))},
        ];
        $scope.currentPage = 1;
        $scope.pageSize = 15;
        $scope.listOfBookings = [];
        $scope.smalltable = true;
        if($rootScope.user.type == 'admin'){
            $scope.listOfBookings = _.where(bookingList,{ 'varificattion' : 'pending'});
        }else{
            $scope.listOfBookings = _.where(bookingList,{ 'Broker_Name' : $rootScope.user.name,'varificattion' : 'pending'});
        }
        $('#deleteModal').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget) // Button that triggered the modal
          $scope.deleteId = button.data('whatever') // Extract info from data-* attributes
        });
        $scope.deleteBooking = function(){
          //use $scope.deleteId to delete form mongodb
          $scope.listOfBookings = _.without($scope.listOfBookings,_.findWhere($scope.listOfBookings, {"_id": $scope.deleteId}));
          bookingService.deleteBooking($scope.deleteId);
          $('#deleteModal').modal('hide');
        }
        $scope.updateStatus = function(booking){
          console.log(booking);
          if(booking.varificattion == 'pending'){
            indexEdit =_.indexOf(_.pluck($scope.listOfBookings,'_id'), booking._id);
            editData = {
              "varificattion" : "completed"
            }
            bookingService.editBooking(booking._id,editData).then(function(){
              $scope.listOfBookings[indexEdit].varificattion = 'completed';
            });
          }else{
            indexEdit =_.indexOf(_.pluck($scope.listOfBookings,'_id'), booking._id);
            editData = {
              "varificattion" : "pending"
            }
            bookingService.editBooking(booking._id,editData).then(function(){
              $scope.listOfBookings[indexEdit].varificattion = 'pending';
            });
            
          }
        }
      },
      resolve: {
        usersList: function(userService){
          return userService.getUsers();  
        },
        bookingList: function(bookingService){
          return bookingService.getBookings();
        },
      }
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
          brokersList: function(userService){
            return userService.getUsers();  
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
          usersList: function(userService){
            return userService.getUsers();  
          }
        }
      })
    .state('place', {
      url: "/place",
      templateUrl: "app/partials/place.html",
      resolve: {
        srhrList: function(placeService){
          return placeService.getPlaces();
        }
      }
    })
      .state('place.add-place', {
        url: "/add-place",
        templateUrl: "app/partials/place.add-place.html",
        controller: 'place.addPlaceCtrl'
      })
      .state('place.show-place', {
        url: "/show-place",
        templateUrl: "app/partials/place.show-place.html",
        controller: 'place.showPlaceCtrl'
      })
    .state('booking', {
      url: "/booking",
      templateUrl: "app/partials/booking.html",
      resolve: {
        bookingList: function(bookingService){
          return bookingService.getBookings();
        },
        usersList: function(userService){
          return userService.getUsers();  
        },
        srhrList: function(placeService){
          return placeService.getPlaces();
        }
      }
    })
      .state('booking.add-booking', {
        url: "/add-booking",
        templateUrl: "app/partials/booking.add-booking.html",
        controller: 'booking.addBookingCtrl'
      })
      .state('booking.show-booking', {
        url: "/show-booking",
        templateUrl: "app/partials/booking.show-booking.html",
        controller: 'booking.showBookingCtrl'
      })
      .state('booking.edit-booking', {
        url: "/edit-booking/:bookingId",
        templateUrl: "app/partials/booking.edit-booking.html",
        controller: 'booking.editBookingCtrl'
      })
    .state('report', {
      url: "/report",
      templateUrl: "app/partials/report.html",
      controller: 'report.showReportCtrl',
      resolve: {
        bookingList: function(bookingService){
          return bookingService.getBookings();
        },
        usersList: function(userService){
          return userService.getUsers();  
        },
        srhrList: function(placeService){
          return placeService.getPlaces();
        }
      }
    })
    ;
}]);

rsvpApp.service('userService', ['$http', '$q','AuthTokenFactory', function($http, $q, AuthTokenFactory){
  var model = this,
        URLS = {
            FETCH: '/api/users'
        },
        users;

    function extract(result) {
        return result.data;
    }

    function cacheUsers(result) {
        users = extract(result);
        return users;
    }

    model.getUsers = function () {
        if (AuthTokenFactory.getToken()) {
          return (users) ? $q.when(users) : $http.get(URLS.FETCH).then(cacheUsers);
        } else {
          return $q.reject({ data: 'client has no auth token' });
        }       
    };

    model.editUser = function (id,editData) {
      if (AuthTokenFactory.getToken()) {
        return $http.put(URLS.FETCH+'/'+id,editData).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.deleteUser = function (id) {
      if (AuthTokenFactory.getToken()) {
        return $http.delete(URLS.FETCH+'/'+id).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.addUser = function (addUser) {
      if (AuthTokenFactory.getToken()) {
        return $http.post(URLS.FETCH,addUser).then(function(result){
          $http.get(URLS.FETCH).then(cacheUsers);
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };
}]);

rsvpApp.service('placeService', ['$http', '$q','AuthTokenFactory', function($http, $q, AuthTokenFactory){
  var model = this,
        URLS = {
            FETCH: '/api/places'
        },
        places;

    function extract(result) {
        return result.data;
    }

    function cachePlaces(result) {
        places = extract(result);
        return places;
    }

    model.getPlaces = function () {
        if (AuthTokenFactory.getToken()) {
          return (places) ? $q.when(places) : $http.get(URLS.FETCH).then(cachePlaces);
        } else {
          return $q.reject({ data: 'client has no auth token' });
        }       
    };

    model.editPlace = function (id,editData) {
      if (AuthTokenFactory.getToken()) {
        return $http.put(URLS.FETCH+'/'+id,editData).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.deletePlace = function (id) {
      if (AuthTokenFactory.getToken()) {
        return $http.delete(URLS.FETCH+'/'+id).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.addPlace = function (addPlace) {
      if (AuthTokenFactory.getToken()) {
        return $http.post(URLS.FETCH,addPlace).then(function(result){
          $http.get(URLS.FETCH).then(cachePlaces);
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };
}]);

rsvpApp.service('bookingService', ['$http', '$q','AuthTokenFactory', function($http, $q, AuthTokenFactory){
  var model = this,
        URLS = {
            FETCH: '/api/booking'
        },
        bookings;

    function extract(result) {
        return result.data;
    }

    function cacheBookings(result) {
        bookings = extract(result);
        return bookings;
    }

    model.getBookings = function () {
        if (AuthTokenFactory.getToken()) {
          return (bookings) ? $q.when(bookings) : $http.get(URLS.FETCH).then(cacheBookings);
        } else {
          return $q.reject({ data: 'client has no auth token' });
        }       
    };

    model.editBooking = function (id,editData) {
      if (AuthTokenFactory.getToken()) {
        return $http.put(URLS.FETCH+'/'+id,editData).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.deleteBooking = function (id) {
      if (AuthTokenFactory.getToken()) {
        return $http.delete(URLS.FETCH+'/'+id).then(function(result){
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };

    model.addBooking = function (addBooking) {
      if (AuthTokenFactory.getToken()) {
        return $http.post(URLS.FETCH,addBooking).then(function(result){
          $http.get(URLS.FETCH).then(cacheBookings);
          return extract(result); 
        });
      } else {
         return $q.reject({ data: 'client has no auth token' });
      }
    };
}]);

rsvpApp.factory('UserFactory', ['$http','AuthTokenFactory','$q', function($http, AuthTokenFactory, $q){
  return {
      login: login,
      logout: logout
    };

  function login(email, password) {
    return $http.post('/api/login', {
      email: email,
      password: password
    }).then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }

  function logout() {
    AuthTokenFactory.setToken();
  }
}])

rsvpApp.factory('AuthTokenFactory', ['$window', function($window){
  var store = $window.localStorage;
  var key = 'auth-token';
  return {
    getToken: getToken,
    setToken: setToken
  };
  function getToken() {
    return store.getItem(key);
  }
  function setToken(token) {
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }
}]);

rsvpApp.factory('AuthInterceptor', ['AuthTokenFactory', function(AuthTokenFactory){
  return {
    request: addToken
  };
  function addToken(config) {
    var token = AuthTokenFactory.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
}]);