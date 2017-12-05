/*
 * Display all vendortypes
 */
adminApp.controller('AllVendorTypesCtrl', function($scope, vendorList,Vendor_subtypes){
        console.log(vendorList)
	$scope.vendortypes = vendorList;
	$scope.activePost = false;
	$scope.setActive = function(post){
            
            var id = post._id
            Vendor_subtypes.subByvendors({ id : id}).then(function(res){
                console.log(res);
                if(res.status==true){
                    $scope.vendor_subtype = res.data
                }
            },err=>{
                console.log(err);
            });
                console.log(post)
		$scope.activePost = post;
	}
});
adminApp.controller('AddVendorTypeCtrl', function($scope, Vendortypes){
	$scope.post = {};
        console.log(Vendortypes)
	$scope.addVendorType = function(){
            console.log($scope.post)
		Vendortypes.add($scope.post).then(function(res){
			console.log(res);
                        if(res.status==true){
                            $scope.post = {};
                            $scope.success_msg = res.message;
                        }else{
                            $scope.error_msg = res.message;
                        }
		});
	};


});
adminApp.controller('addVendorTypeSubCtrl', function($scope, vendortypeList, Vendor_subtypes){
	$scope.post = {multiple : false};
        $scope.data = {};
    
        $scope.allvendortypes = vendortypeList; 
        $scope.addVendorType = function(){
            var details = $scope.data.split("-");
            $scope.postdata = {
                vendortype_id : details[1],
                vendortype : details[0],
                title : $scope.post.title,
                multiple : $scope.post.multiple,
            }
            console.log($scope.postdata);
            Vendor_subtypes.add($scope.postdata).then(function(res){
                    console.log(res);
                    if(res.status==true){
                        $scope.post = {multiple : false};
                        $scope.success_msg = res.message;
                        $scope.error_msg = ''
                    }else{
                        $scope.error_msg = res.message;
                        $scope.success_msg = ''
                    }
            },err=>{
                console.log(err);
            });
	};

});