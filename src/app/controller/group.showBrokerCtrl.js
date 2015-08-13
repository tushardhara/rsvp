rsvpApp.controller('group.showBrokerCtrl', ['$scope','brokersList','userService',function($scope,brokersList,userService){
  $scope.currentPage = 1;
  $scope.pageSize = 15;
  $scope.listOfBrokers = [];
  var temp_listOfBrokers = _.where(brokersList,{ 'type' : 'broker'});
  _.each(temp_listOfBrokers,function(value,key){
    _.each(value.details,function(valueD,keyD){
      $scope.listOfBrokers.push({
        'id' : value._id,
        'brokername' : value.name,
        'brokercompany': valueD.brokercompany,
        'brokeremail' : value.email,
        'brokerpercentage' : valueD.brokerpercentage
      })
    })
  });

  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $scope.brokerData = button.data('whatever') // Extract info from data-* attributes
  });
  $scope.deleteBroker = function(typedelete){
    //use $scope.deleteId to delete form mongodb
    if(typedelete == 1){
      $scope.listOfBrokers = _.difference($scope.listOfBrokers,_.where($scope.listOfBrokers, {id: $scope.brokerData.id}));
      userService.deleteUser($scope.brokerData.id);
    }
    if(typedelete == 2){
      $scope.listOfBrokers = _.without($scope.listOfBrokers,_.findWhere($scope.listOfBrokers, {id: $scope.brokerData.id}));
      indexEdit =_.indexOf(_.pluck(temp_listOfBrokers,'_id'), $scope.brokerData.id);
      console.log(indexEdit);
      indexDelete =_.indexOf(_.pluck(temp_listOfBrokers[indexEdit].details,'brokercompany'), $scope.brokerData.brokercompany);
      temp_listOfBrokers[indexEdit].details.splice(indexDelete, 1);
      editData =  temp_listOfBrokers[indexEdit];
      delete editData["_id"];
      userService.editUser($scope.brokerData.id,editData);
    } 
    $('#deleteModal').modal('hide');
  }
  $scope.editOpen = function(broker){
    $scope.brokertemp = broker;
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
        temp = $scope.listOfBrokers;
        _.each(temp,function(value,key){
          if(value["id"] ==  $scope.editContent.id){
            $scope.listOfBrokers[key].brokername = $scope.editContent.brokername;
            $scope.listOfBrokers[key].brokeremail = $scope.editContent.brokeremail;
          }
        });

        $scope.listOfBrokers[indexEdit].brokercompany = $scope.editContent.brokercompany;
        $scope.listOfBrokers[indexEdit].brokerpercentage = $scope.editContent.brokerpercentage;
      
        indexEdit = _.indexOf(_.pluck(temp_listOfBrokers,'_id'), $scope.editContent.id);
        $scope.editBroker = {};
        $scope.editBroker.name = $scope.editContent.brokername;
        $scope.editBroker.email = $scope.editContent.brokeremail;
        indexCompany = _.indexOf(_.pluck(temp_listOfBrokers[indexEdit].details,'brokercompany'), $scope.brokertemp.brokercompany);
        temp_listOfBrokers[indexEdit].details[indexCompany].brokercompany = $scope.editContent.brokercompany;
        temp_listOfBrokers[indexEdit].details[indexCompany].brokerpercentage = $scope.editContent.brokerpercentage;
        $scope.editBroker.details = temp_listOfBrokers[indexEdit].details;

        userService.editUser($scope.editContent.id,$scope.editBroker);
        $('#editModal').modal('hide');
      }
  }
}])
