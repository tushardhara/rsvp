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
      })
      .state('group.show-broker', {
        url: "/show-broker",
        templateUrl: "app/partials/group.show-broker.html",
        controller: function($scope) {
          $scope.currentPage = 1;
          $scope.pageSize = 2;
          $scope.listOfBrokers = [
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

          $('#deleteModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            $scope.deleteId = button.data('whatever') // Extract info from data-* attributes
          });
          $scope.deleteBroker = function(){
            //use $scope.deleteId to delete form mongodb
            $scope.listOfBrokers = _.without($scope.listOfBrokers,_.findWhere($scope.listOfBrokers, {id: $scope.deleteId}));
            $('#deleteModal').modal('hide');
          }
          $scope.editOpen = function(broker){
            $scope.editContent = {
              "id" : broker.id,
              "brokername" : broker.brokername,
              "brokercompany" : broker.brokercompany,
              "brokeremail" : broker.brokeremail,
              "brokerpercentage" : broker.brokerpercentage
            }
          }
          $scope.editBroker = function(isValid){
              if(isValid){
                //use $scope.deleteId to delete form mongodb
                indexEdit =_.indexOf(_.pluck($scope.listOfBrokers,'id'), $scope.editContent.id);
                $scope.listOfBrokers[indexEdit] = {
                  "id" : $scope.editContent.id,
                  "brokername" : $scope.editContent.brokername,
                  "brokercompany" : $scope.editContent.brokercompany,
                  "brokeremail" : $scope.editContent.brokeremail,
                  "brokerpercentage" : $scope.editContent.brokerpercentage
                }
                $('#editModal').modal('hide');
              }
          }
        }
      })
      .state('group.add-user', {
        url: "/add-user",
        templateUrl: "app/partials/group.add-user.html",
      })
      .state('group.show-user', {
        url: "/show-user",
        templateUrl: "app/partials/group.show-user.html",
      })
    ;
});