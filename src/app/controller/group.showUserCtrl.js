rsvpApp.controller('group.showUserCtrl', ['$scope','usersList',function($scope,usersList){
  $scope.currentPage = 1;
  $scope.pageSize = 2;
  $scope.listOfUsers = usersList;

  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $scope.deleteId = button.data('whatever') // Extract info from data-* attributes
  });
  $scope.deleteUser = function(){
    //use $scope.deleteId to delete form mongodb
    $scope.listOfUsers = _.without($scope.listOfUsers,_.findWhere($scope.listOfUsers, {id: $scope.deleteId}));
    $('#deleteModal').modal('hide');
  }
  $scope.editOpen = function(user){
    $scope.editContent = {
      "id" : user.id,
      "username" : user.username,
      "useremail" : user.useremail
    }
  }
  $scope.editUser = function(isValid){
      if(isValid){
        //use $scope.deleteId to delete form mongodb
        indexEdit =_.indexOf(_.pluck($scope.listOfUsers,'id'), $scope.editContent.id);
        $scope.listOfUsers[indexEdit] = {
          "id" : $scope.editContent.id,
          "username" : $scope.editContent.username,
          "useremail" : $scope.editContent.useremail
        }
        $('#editModal').modal('hide');
      }
  }
}])
