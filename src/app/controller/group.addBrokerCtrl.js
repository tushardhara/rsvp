rsvpApp.controller('group.addBrokerCtrl', ['$scope','userService',function($scope,userService){
	$scope.brokersAddList = [{
		'brokercompany' : '',
	    'brokerpercentage' : ''
	}];
	$scope.addMore = function(){
		$scope.brokersAddList.push({
	      'brokercompany' : '',
	      'brokerpercentage' : ''
	    });
	}
	$scope.deleteMore = function(index){
	    $scope.brokersAddList.splice(index,1);
	}
	$scope.addBroker = function(isValid){
	    if(isValid){
	      	$scope.addBrokerData = {
	          	'name' : $scope.brokername,
	          	'email' : $scope.brokeremail,
	          	'type' : 'broker',
	          	'details' : $scope.brokersAddList,
	          	'password' : 'qwerty@#143'
        	};
	      	userService.addUser($scope.addBrokerData).then(function(data){
	      		alert("Broker is Added");
	      		$scope.brokername = "";
	      		$scope.brokeremail = "";
	      		$scope.brokersAddList = [{
					'brokercompany' : '',
				    'brokerpercentage' : ''
				}];
	      	})
	    }
	}
}]);