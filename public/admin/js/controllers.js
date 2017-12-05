
adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});
adminApp.controller('ForgotPasswordCtrl', function($scope, Users){
    console.log('fdhfgh');
    $scope.user={};
    $scope.forgetPassword=function(){
        Users.forgetpass(this.user).then(function(res) {
            console.log(res)
            if(res.status==true){
                $scope.success_msg=res.message;
            }else{
                $scope.error_msg=res.message;
            }
        })
    }
});
adminApp.controller('AllPostsCtrl', function($scope, postList){
	$scope.posts = postList;
	$scope.activePost = false;
	$scope.setActive = function(post){
		$scope.activePost = post;
	}
});

adminApp.controller('AddPostCtrl', function($scope, Posts){
    console.log($scope.currentUser)
	$scope.post = {};
	$scope.addPost = function(newPost){
            newPost.slug = newPost.title.replace(/ /g,'')
            newPost.slug = newPost.slug.toLowerCase();
            newPost.posted_by = $scope.currentUser._id;
            newPost.post_type='JobPost';
            console.log(newPost)
            Posts.add(newPost).then(function(res){
                console.log(res);
                if(res.status==true){
                    $scope.post = {};
                    $scope.success_msg = res.message;
                }else{
                    $scope.error_msg = res.message;
                }
            });
	};
        // add blog
        $scope.addBlog = function(newPost){
            newPost.slug = newPost.title.replace(/ /g,'')
            newPost.slug = newPost.slug.toLowerCase();
            newPost.posted_by = $scope.currentUser._id;
            if($scope.imgshow){
                newPost.image = $scope.imgshow;
            }
            newPost.post_type='BlogPost';
            console.log(newPost)
            Posts.addBlog(newPost).then(function(res){
                console.log(res);
                if(res.status==true){
                    $scope.post = {};
                    $scope.imgshow={};
                    $scope.success_msg = res.message;
                }else{
                    $scope.error_msg = res.message;
                }
            });
	};
        // upload image
        $scope.uploadFile = function(input) {
          $scope.loading = true;
     // console.log(input.files[0]);
        Posts.uploadimage(input.files[0]).then(function(res) {
            console.log(res[0].location);
            $scope.loading = false;
            if (res) {                
                $scope.imgshow = res[0].location;
                $scope.post.image=$scope.imgshow;
            } 
        });
    };
});
/*
* Dashboard controller
*/
adminApp.controller('dashboardCtrl', function($scope) {
    
});
/**
 * AllUsersCtrl
 */
adminApp.controller('AllUsersCtrl', function($scope, userList,Users,$location) {
    console.log('userList')
    $scope.users = userList;
    $scope.activePost = false;
    $scope.setActive = function(user) {
        $scope.activeUser = user;
        console.log($scope.activeUser);
        
    }
    $scope.deleteUser = function(id) {
        $scope.data={};
         $scope.data.id=id;
         console.log($scope.data);
        Users.remove($scope.data).then(function(res) {
            console.log(res);
            if (res) {
                alert(res.message);
                window.location.reload();
            } else {
                $scope.update = "error";
            }
        });
    }
});
/*
* Add user
*/
adminApp.controller('addUserCtrl',function($scope,Users){
    $scope.user = {}
    $scope.addUser = function(){
        console.log(this.user); //return false;
        $scope.newUser = {};
        $scope.newUser.email = this.user.email;
        $scope.newUser.password = this.user.password;
        $scope.newUser.firstname = this.user.firstname;
        $scope.newUser.lastname = this.user.lastname;
        $scope.newUser.dob = this.user.dob;
        $scope.newUser.role = this.user.role;
        $scope.newUser.status = this.user.status;
        Users.add($scope.newUser).then(function(res) {
            console.log(res);
        });
        console.log('added')
        // Users.add($scope.newPost);
        this.user = {};
        
    }
});
/**
 * EditUsersCtrl
 */
adminApp.controller('editUserCtrl', function($scope, Users, $stateParams) {
    $scope.user = {};
    $scope.params = {};
    $scope.params.path = $stateParams.paraml;
    Users.sigledata($scope.params).then(function(res) {
        if (res == null) {
            window.location.href = '/404';
        } else {
             console.log(res);
            $scope.user.firstname = res.firstname;
            $scope.user.lastname = res.lastname;
            $scope.user.email = res.email;
            $scope.user.dob = res.dob;
            $scope.user.role = res.role;
            $scope.user.status = res.status;
            $scope.user.id = res._id;
        }
    });
    $scope.editPost = function() {

        $scope.newPost = {};
        $scope.newPost.firstname = this.user.firstname;
        $scope.newPost.lastname = this.user.lastname;
        $scope.newPost.email = this.user.email;
        $scope.newPost.dob = this.user.dob;
        $scope.newPost.role = this.user.role;
        $scope.newPost.status = this.user.status;
        $scope.newPost.id = this.user.id;
        console.log($scope.newPost)
        Users.update($scope.newPost).then(function(res) {
            console.log(res);
            if (res) {
                $scope.update = res.message;
            } else {
                $scope.update = "error";
            }
            // console.log(res);
        });
    }
})
/**
 * AllUsersCtrl
 */
adminApp.controller('AllContactsCtrl', function($scope, contactList,Contacts,$location) {
    console.log('userList')
    $scope.contacts = contactList;
    $scope.activePost = false;
    $scope.setActive = function(user) {
        $scope.activeUser = user;
        console.log($scope.activeUser);
        
    }
    $scope.deleteUser = function(id) {
        $scope.data={};
         $scope.data.id=id;
         console.log($scope.data);
        Contacts.remove($scope.data).then(function(res) {
            console.log(res);
            if (res) {
                alert(res.message);
                window.location.reload();
            } else {
                $scope.update = "error";
            }
        });
    }
});
/*
 * addFAQ controller
 */
adminApp.controller('addFaqCtrl', function($scope,Faqs) {
    $scope.post = {}
    $scope.addFaq = function(){
        console.log(this.post); //return false;
        $scope.newPost = {};
        $scope.newPost.title = this.post.title;
        $scope.newPost.body = this.post.body;
        Faqs.add($scope.newPost).then(function(res) {
            console.log(res);
            $scope.message=res.message
        });
        // Users.add($scope.newPost);
        this.post = {};
        
    }
})
/**
 * AllFaqsCtrl
 */
adminApp.controller('AllFaqsCtrl', function($scope, faqList, Faqs) {
    $scope.faqs = faqList;
    $scope.activePost = false;
    $scope.setActive = function(user) {
        $scope.activeUser = user;
        
    }
    $scope.deleteFaq = function(id) {
        $scope.data={};
         $scope.data.id=id;
        Faqs.remove($scope.data).then(function(res) {
            if (res) {
                //console.log(res)
                alert(res.message);
                window.location.reload();
            } else {
                $scope.update = "error";
            }
        });
    }
});
/**
 * EditFaqsCtrl
 */
adminApp.controller('editFaqCtrl', function($scope, Faqs, $stateParams) {
    $scope.user = {};
    $scope.params = {};
    $scope.params.path = $stateParams.faq_id;
    Faqs.singledata($scope.params).then(function(res) {
        if (res == null) {
            window.location.href = '/404';
        } else {
             console.log(res);
            $scope.user.title = res.title;
            $scope.user.body = res.body;
            $scope.user.id = res._id;
        }
    });
    $scope.editFaq = function() {

        $scope.newPost = {};
        $scope.newPost.title = this.user.title;
        $scope.newPost.body = this.user.body;
        $scope.newPost.id = this.user.id;
        console.log($scope.newPost)
        Faqs.update($scope.newPost).then(function(res) {
            console.log(res);
            if (res) {
                $scope.message = res.message;
            } else {
                $scope.message = "error while saving";
            }
        });
    }
})
