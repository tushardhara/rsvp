rsvpApp.controller('group.addUserCtrl', ['$scope','userService',function($scope,userService){
	$scope.addUser = function(isValid){
	    if(isValid){
	      	$scope.addUserData = {
	      		'name' : $scope.username,
		        'email' : $scope.useremail,
		        'type' : 'user',
		        'password' : 'qwerty@#143'
	      	};
	      	userService.addUser($scope.addUserData).then(function(data){
	      		alert("User is Added");
	      	})
	    }
	}
}]);