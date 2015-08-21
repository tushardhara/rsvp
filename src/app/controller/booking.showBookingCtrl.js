rsvpApp.controller('booking.showBookingCtrl', ['$scope','bookingList','bookingService','$cookies','$rootScope',function($scope,bookingList,bookingService,$cookies,$rootScope){
	if($cookies.getObject('user') != null){
      $rootScope.user = $cookies.getObject('user');
    }else{
      $location.path('/');
    }
	$scope.currentPage = 1;
  	$scope.pageSize = 15;
  	$scope.listOfBookings = [];
  	$scope.smalltable = true;
  	if($rootScope.user.type == 'admin'){
  	    $scope.listOfBookings = bookingList;
  	}else{
  	    $scope.listOfBookings = _.where(bookingList,{ 'Broker_Name' : $rootScope.user.name});
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
}]);