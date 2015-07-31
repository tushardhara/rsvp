rsvpApp.controller('group.showBrokerCtrl', ['$scope','brokersList',function($scope,brokersList){
  $scope.currentPage = 1;
  $scope.pageSize = 2;
  $scope.listOfBrokers = brokersList;

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
}])
