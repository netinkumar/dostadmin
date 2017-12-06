/*
 * Display all vendortypes
 */
adminApp.controller('AllVendorTypesCtrl', function($scope, vendorList,Vendortypes,Vendor_subtypes){
        console.log(vendorList)
	$scope.vendortypes = vendorList.data;
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
        
        $scope.deleteType = function(id){
            var vendortype_id = id;
            Vendortypes.remove({id : vendortype_id}).then(function(res){
                console.log(res);
                if(res.status == true){
                    alert(res.message)
                     Vendortypes.all().then(function(res){
                        console.log(res);
                        $scope.vendortypes = res.data;
                    })
                } else {
                   
                }
            })
        }
});
adminApp.controller('AddVendorTypeCtrl', function($scope, Vendortypes){
        
        $scope.post = {
               multiple : false,
               services : [],
               more_addons : false,
               more_highlights: false,
        };
        $scope.fields = [];
        $scope.more_services = [];
        $scope.addon_check = false;
        $scope.highlight_check = false;
	$scope.addVendorType = function(){
            console.log($scope.post)
           console.log( $scope.highlight_check )
            for(let i in $scope.more_services){
                $scope.post.services.push($scope.more_services[i])
            }
            if($scope.addon_check == false){
                 $scope.post.addons = '';
            } if ($scope.highlight_check == false){
                 $scope.post.highlights = '';
            }
            
            console.log($scope.post)
            Vendortypes.add($scope.post).then(function(res){
                    console.log(res);
                    if(res.status==true){
                        $scope.success_msg = res.message;
                        $scope.error_msg = '';
                        $scope.post = { multiple : false, 
                                        services : [],
                                        more_addons : false,
                                        more_highlights: false };
                        $scope.addon_check = false;
                        $scope.highlight_check = false;
                        $scope.more_services = [];
                        $scope.fields = [];
                    }else{
                        $scope.error_msg = res.message;
                         $scope.success_msg = '';
                    }
            });
	};
        
        $scope.additionalservices = function () {
            $scope.fields.push(Math.random());
        }
        $scope.removeservice = function(){
            $scope.fields.pop();
            $scope.more_services.pop();
            if($scope.post.services.length > 1){
                 $scope.post.services.pop();
            }
            console.log($scope.post)
        }


});
adminApp.controller('addVendorTypeSubCtrl', function($scope, vendortypeList, Vendor_subtypes){
	
        $scope.data = {};
    
        $scope.allvendortypes = vendortypeList.data; 
        $scope.addVendorType = function(){
            var details = $scope.data.split("-");
            $scope.postdata = {
                vendortype_id : details[1],
                vendortype : details[0],
                title : $scope.post.title,
            }
            console.log($scope.postdata);
            Vendor_subtypes.add($scope.postdata).then(function(res){
                    console.log(res);
                    if(res.status==true){
                        $scope.post = {};
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