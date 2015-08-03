rsvpApp.controller('group.addUserCtrl', ['$scope',function($scope){
	$scope.addUser = function(isValid){
	    if(isValid){
	      	$scope.addUserData = {
	      		'username' : $scope.username,
		        'useremail' : $scope.useremail,
	      	};
	      	console.log($scope.addUserData);
	    }
	}
}]);