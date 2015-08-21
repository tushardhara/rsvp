rsvpApp.controller('group.showUserCtrl', ['$scope','usersList','userService','$cookies','$rootScope',function($scope,usersList,userService,$cookies,$rootScope){
  if($cookies.getObject('user') != null){
    $rootScope.user = $cookies.getObject('user');
  }else{
    $location.path('/');
  }
  $scope.currentPage = 1;
  $scope.pageSize = 15;
  $scope.listOfUsers = _.where(usersList,{ 'type' : 'user'});
  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $scope.deleteId = button.data('whatever') // Extract info from data-* attributes
  });
  $scope.deleteUser = function(){
    //use $scope.deleteId to delete form mongodb
    $scope.listOfUsers = _.without($scope.listOfUsers,_.findWhere($scope.listOfUsers, {"_id": $scope.deleteId}));
    userService.deleteUser($scope.deleteId);
    $('#deleteModal').modal('hide');
  }
  $scope.editOpen = function(user){
    $scope.editContent = {
      "id" : user._id,
      "username" : user.name,
      "useremail" : user.email
    }
  }
  $scope.editUser = function(isValid){
      if(isValid){
        //use $scope.deleteId to delete form mongodb
        indexEdit =_.indexOf(_.pluck($scope.listOfUsers,'_id'), $scope.editContent.id);
        $scope.listOfUsers[indexEdit].name = $scope.editContent.username;
        $scope.listOfUsers[indexEdit].email = $scope.editContent.useremail;
        var editDataMongo = {
          "name" : $scope.editContent.username,
          "email" : $scope.editContent.useremail
        }
        userService.editUser($scope.editContent.id,editDataMongo);
        $('#editModal').modal('hide');
      }
  }
}])
