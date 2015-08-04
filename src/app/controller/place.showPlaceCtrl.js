rsvpApp.controller('place.showPlaceCtrl', ['$scope','srhrList',function($scope,srhrList){
  $scope.currentPage = 1;
  $scope.pageSize = 5;
  $scope.listOfPlaces = [];
  _.each(srhrList,function(valueS,keyS){
    _.each(valueS.regions,function(valueR,keyR){
      _.each(valueR.hotels,function(valueH,keyH){
        _.each(valueH.roomtype,function(valueRT,keyRT){
          $scope.listOfPlaces.push({
            "id"        : valueS.id,
            "statename" : valueS.state,
            "regionname": valueR.name,
            "hotelname" : valueH.name,
            "roomtype"  : valueRT
          })
        });
      });
    });
  });
  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $scope.deleteData = button.data('whatever') // Extract info from data-* attributes
  });
  $scope.deletePlace = function(typedelete){
    //use $scope.deleteId to delete form mongodb
    if(typedelete == 1){
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id}));
    }
    if(typedelete == 2){
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname}));
    }
    if(typedelete == 3){
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname , hotelname:$scope.deleteData.hotelname}));
    }
    if(typedelete == 4){
      $scope.listOfPlaces = _.difference($scope.listOfPlaces,_.where($scope.listOfPlaces, {id: $scope.deleteData.id, regionname: $scope.deleteData.regionname , hotelname:$scope.deleteData.hotelname , roomtype:$scope.deleteData.roomtype}));
    }
    $('#deleteModal').modal('hide');
  }
  $scope.editOpen = function(place){
    $scope.placeData = place;
    $scope.editContent = {
      "id" : place.id,
      "statename" : place.statename,
      "regionname" : place.regionname,
      "hotelname" : place.hotelname,
      "roomtype" : place.roomtype
    }
  }
  $scope.editPlace = function(isValid){

      if(isValid){
        regions = $scope.placeData.regionname;
        hotels = $scope.placeData.hotelname;
        type = $scope.placeData.roomtype;
        //use $scope.deleteId to delete form mongodb
        temp = $scope.listOfPlaces;
        _.each(temp,function(value,key){
          if($scope.editContent.id == value.id){
            $scope.listOfPlaces[key]['statename'] = $scope.editContent.statename
          }
          if($scope.editContent.id == value.id && value.regionname == regions){
            $scope.listOfPlaces[key]['regionname'] = $scope.editContent.regionname
          }
          if($scope.editContent.id == value.id && $scope.editContent.regionname == value.regionname && value.hotelname == hotels){
            $scope.listOfPlaces[key]['hotelname'] = $scope.editContent.hotelname
          }
          if($scope.editContent.id == value.id && $scope.editContent.regionname == value.regionname && $scope.editContent.hotelname == value.hotelname && value.roomtype == type){
            $scope.listOfPlaces[key]['roomtype'] = $scope.editContent.roomtype
          }
        })
        
        $('#editModal').modal('hide');
      }
  }
}])