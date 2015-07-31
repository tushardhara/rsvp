rsvpApp.controller('group.addBrokerCtrl', ['$scope',function($scope){
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
	      	$scope.addBrokerData = [];
	      	_.each($scope.brokersAddList,function(value,key){
	        	$scope.addBrokerData.push({
		          	'brokername' : $scope.brokername,
		          	'brokeremail' : $scope.brokeremail,
		          	'brokercompany' : value.brokercompany,
		          	'brokerpercentage' : value.brokerpercentage
	        	});
	      	});
	      	console.log($scope.addBrokerData);
	    }
	}
}]);