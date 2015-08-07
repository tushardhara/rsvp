var rsvpApp = angular.module('rsvpApp', ['ui.router','angularUtils.directives.dirPagination']);
rsvpApp.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/",
      templateUrl: "app/partials/login.html",
      controller: function($scope,$location,UserFactory,$rootScope) {
        $scope.submitForm = function(isValid) {
          // check to make sure the form is completely valid
          if (isValid) {
            UserFactory.login($scope.user.email, $scope.user.password).then(function success(response) {
              $rootScope.user = response.data.user;
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
      controller: function($scope,$location,UserFactory,$rootScope) {
        UserFactory.logout();
        $rootScope.user = null;
        $location.path('/');
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
          srhrList: function(){
            return [
              {
                "id":1,
                "state" : "New South Wales",
                "regions" : [
                  {
                    "name" : "Sydney Olympic Park 1",
                    "hotels" : [
                      {
                        "name" : "Quest Sydney Olympic Park hotel 1",
                        "roomtype" : [
                          "Single King",
                          "City View Room",
                          "Studio",
                          "King Room",
                          "Deluxe Room"
                        ]
                      },
                      {
                        "name" : "Quest Sydney Olympic Park hotel 2",
                        "roomtype" : [
                          "Single King",
                          "City View Room",
                          "Studio",
                          "King Room",
                          "Deluxe Room"
                        ]
                      }
                    ]
                  },
                  {
                    "name" : "Sydney Olympic Park 2",
                    "hotels" : [
                      {
                        "name" : "Quest Sydney Olympic Park",
                        "roomtype" : [
                          "Single King",
                          "City View Room",
                          "Studio",
                          "King Room",
                          "Deluxe Room"
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "id":2,
                "state" : "New South Wales",
                "regions" : [
                  {
                    "name" : "Sydney Olympic Park 1",
                    "hotels" : [
                      {
                        "name" : "Quest Sydney Olympic Park",
                        "roomtype" : [
                          "Single King",
                          "City View Room",
                          "Studio",
                          "King Room",
                          "Deluxe Room"
                        ]
                      }
                    ]
                  },
                  {
                    "name" : "Sydney Olympic Park 2",
                    "hotels" : [
                      {
                        "name" : "Quest Sydney Olympic Park",
                        "roomtype" : [
                          "Single King",
                          "City View Room",
                          "Studio",
                          "King Room",
                          "Deluxe Room"
                        ]
                      }
                    ]
                  }
                ]
              }
            ];
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
    ;
}).service('userService', ['$http', '$q','AuthTokenFactory', function($http, $q,AuthTokenFactory){
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

  function getUser() {
    if (AuthTokenFactory.getToken()) {
      return $http.get(API_URL + '/me');
    } else {
      return $q.reject({ data: 'client has no auth token' });
    }
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