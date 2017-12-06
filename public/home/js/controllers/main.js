app.controller('MainCtrl', function ($scope, $mdSidenav, $mdUtil, $log,Users,$window, $timeout, $interval, $location,Vendortypes) {
console.log('MainCtrl')
$scope.user={};
$scope.forgetPassword=function(){
    console.log('abc')
    Users.forgetpass(this.user).then(function(res) {
        console.log(res)
    })
}

    
    $scope.toggleRight = buildToggler('right');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },300);

      return debounceFn;
    }
    
  })
  /*
   * SignupCtrl
   * @param {type} $scope
   * @param {type} Users
   * @param {type} $timeout
   * @returns {undefined}
   */
.controller('SignupCtrl',function($scope,Users,$timeout){
    // validations on signup
    /*
     * Form validations
     */
    $timeout(function() {
         $('#signup_user').formValidation({
             //this uses the formvalidation.io jquery plugin to ensure things like , email and password is provided.
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh',
                excluded: [':disabled', ':hidden', ':not(:visible)'],
            },
            live: "enabled",
            fields: {
                name: {
                    message: "Name is required",
                    validators: {
                        notEmpty: {
                            message: "Please provide your Name"
                        }
                    }
                },
                email: {
                    message: "Email is required",
                    validators: {
                        notEmpty: {
                            message: "Please provide your Email"
                        },
                        emailAddress: {
                            message: "Invalid Email"
                        },
//                        remote: {
//                            message: 'The E-mail is already registered',
//                            url: 'http://localhost:3000/response'
//                        }
                    }
                },
                password: {
                    message: "Password required",
                    validators: {
                        notEmpty: {
                            message: "Please provide password"
                        },
                        identical: {
                            field: 'confirmPassword',
                            message: 'The password and its confirm are not the same'
                        },
                        securepassword: true
                    }
                },
                ConfirmPassword: {
                    message: "Confirm Password required",
                    validators: {
                        notEmpty: {
                            message: "Please provide confirm password"
                        },
                        identical: {
                            field: 'password',
                            message: 'The password and its confirm are not the same'
                        },
                        securepassword: true
                    }
                }


            }
        });
    })
    // 
    $scope.register = function() {
        console.log(this.user);
        if(Object.keys(this.user).length < 4){
           // $scope.message = "Please enter empty fields!";
            return false;
        }else{
            this.user.role='user'
            Users.homeadd(this.user).then(function(res) {
                console.log(res);
                if (res.status==true) {
                    $scope.user = {}
                    $scope.success_msg = res.message;
                } else {
                    $scope.error_msg = res;
                }
            });
        }
    }

})

.controller('SigninCtrl',function($scope,Users,$timeout,$window,$rootScope){
    // login to web
    $scope.user = {};
    $timeout(function() {
         $('#signin_user').formValidation({
             //this uses the formvalidation.io jquery plugin to ensure things like , email and password is provided.
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh',
                excluded: [':disabled', ':hidden', ':not(:visible)'],
            },
            live: "enabled",
            fields: {
                
                email: {
                    message: "Email is required",
                    validators: {
                        notEmpty: {
                            message: "Please provide your Email"
                        },
                        emailAddress: {
                            message: "Invalid Email"
                        }
                    }
                },
                password: {
                    message: "Password required",
                    validators: {
                        notEmpty: {
                            message: "Please provide password"
                        },
                        identical: {
                            field: 'confirmPassword',
                            message: 'The password and its confirm are not the same'
                        },
                        securepassword: true
                    }
                }


            }
        });
    })
    $scope.login = function () {
        console.log($scope.user)
        $scope.error_msg = ''
        if (Object.keys(this.user).length == 0) {
            return false;
        } else {

            Users.login(this.user).then(function (res) {
                console.log(res);
                if (res.status == false) {
                    if(res.data.message == 'Incorrect phone'){
                        $scope.error_msg = res.data.message + '. Are you sure you are registered with us?';
                    } else {
                          $scope.error_msg = res.data.message 
                    }

                } else {
                    $scope.success_msg = "You have successfully logged in.";
                    $window.localStorage['phone'] = JSON.stringify(res.data.phone);
                    $rootScope.currentUser = res.data;
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    var myprofile = function () {
                        $window.location.replace('http://hunny-env-1.sfftrpytm8.us-east-1.elasticbeanstalk.com/list?=all');
                    };
                    $timeout(myprofile, 1000);
                    //console.log("here1");
                }
            });
        }
    }
})
// .controller('VendorSignupCtrl',function($scope,Users){
//     console.log('process')
//     alert('kaa')
// })
// .controller('VendorProcessCtrl',function($scope,Users){
//     console.log('process')
//     alert('kk')
// })
.controller('editprofileCtrl',function($scope,Users,$stateParams){
    $scope.user = {};
    $scope.params = {};
    $scope.params.path = $stateParams.user_id;
    Users.sigledata($scope.params).then(function(res) {
        console.log(res)
        if (res == null) {
            window.location.href = '/404';
        } else {
             console.log(res);
            $scope.user.firstname = res.firstname;
            $scope.user.lastname = res.lastname;
            $scope.user.email = res.email;
            $scope.user.dob = res.dob;
            $scope.user.address = res.address;
            $scope.user.phone = res.phone;
            $scope.user.role = res.role;
            $scope.user.image = res.image;
            $scope.user.status = res.status;
            $scope.user.id = res._id;
        }
    });
    // upload image
     $scope.uploadFile = function(input) {
          $scope.loading = true;
     // console.log(input.files[0]);
        Users.uploadimage(input.files[0]).then(function(res) {
            console.log(res[0].location);
            $scope.loading = false;
            if (res) {                
                $scope.imgshow = res[0].location;
            } 
        });
    };
    
    $scope.editprofile = function() {
        $scope.newPost = {};
        $scope.newPost.firstname = this.user.firstname;
        $scope.newPost.lastname = this.user.lastname;
        $scope.newPost.email = this.user.email;
        $scope.newPost.dob = this.user.dob;
        $scope.newPost.address = this.user.address;
        $scope.newPost.phone = this.user.phone;
        $scope.newPost.role = this.user.role;
        $scope.newPost.status = this.user.status;
        $scope.newPost.image = $scope.imgshow;
        $scope.newPost.id = this.user.id;
        console.log($scope.newPost)
        Users.update($scope.newPost).then(function(res) {
            console.log(res);
            if (res.status=='true') {
                $scope.update = res.message;
            } else {
                $scope.update = "error";
            }
            // console.log(res);
        });
    }
})
.controller('changepasswordCtrl', function ($scope, Users,$stateParams) {
    $scope.user ={}
    $scope.changePassword = function(){
        if($scope.user.new_password != $scope.user.renew_password){
            $scope.error_msg = "Password did not match!"
        }else{
            // go ahead
            $scope.UpdatePassword ={};
            $scope.UpdatePassword.id=$stateParams.user_id;
            $scope.UpdatePassword.password=$scope.user.new_password;
            Users.chnagepass($scope.UpdatePassword).then(function(res){
                console.log(res)
                 $scope.user ={}
                if(res.status==true){
                    $scope.success_msg=res.message;
                }else{
                    $scope.error_msg=res.message;
                }
            })
        }
    }
    
})
  .controller('ContactCtrl', function ($scope, Contacts) {
    $scope.post = {}
    $scope.addNew = function(){
        console.log($scope.post)
        Contacts.add($scope.post).then(function(res){
            console.log(res)
            console.log(res.status)
            if(res.status == true){
                $scope.message = "Thanks for contacting us! We will get back to you Soon!"
            }else{
                $scope.message = "Error while saving data. Please try again later!"
            }
            $scope.post={}
            console.log($scope.message)
        })
    }
  })
  /**
 * EditUsersCtrl
 */
.controller('viewProfileCtrl', function($scope, Users, $stateParams) {
    $scope.user = {};
    $scope.params = {};
    console.log($stateParams)
    $scope.params.path = $stateParams.organizerid;
    console.log($scope.params)
    Users.sigledata($scope.params).then(function(res) {
        if (res == null) {
            window.location.href = '/404';
        } else {
             console.log(res);
             $scope.organizer = res;
//            $scope.user.firstname = res.firstname;
//            $scope.user.lastname = res.lastname;
//            $scope.user.email = res.email;
//            $scope.user.dob = res.dob;
//            $scope.user.role = res.role;
//            $scope.user.status = res.status;
//            $scope.user.id = res._id;
        }
    });
})

app.controller('ForgetCtrl', function ($scope, $timeout, Users, $window, $rootScope) {
    //  console.log($rootScope.salt);
    if (sessionStorage.getItem('user') == null || sessionStorage.getItem('user') == undefined) {
        $rootScope.currentUser = null;

    } else {
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
        $rootScope.salt = $rootScope.currentUser.salt
    }
     // not worked
     
    $scope.sendemmail = function () {
        Users.chnagepass(postdata).then(function (res) {
            if (res.status == true) {
                $scope.success_msg = res.message;
            } else {
                $scope.error_msg = res.message;
            }
        });
    }
    $scope.logout = function () {
        sessionStorage.clear();
        $rootScope.currentUser = null;
        $window.location.replace('http://hunny-env-1.sfftrpytm8.us-east-1.elasticbeanstalk.com/home/logout')
    }
})

.controller('FaqsCtrl', function ($scope,Faqs) {
    console.log('FaqsCtrl')
    Faqs.all().then(function(data){
        console.log('1')
        console.log(data)
        $scope.faqs = data;
//            return data;
    });
//    $scope.faqs = FaqsList
//   console.log(FaqsList)
  })
  .controller('SidenavCtrl', function ($scope, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })
 
.controller('invitationCtrl', function ($scope, $mdSidenav, $window, $log, Users) {
     console.log('HOney')
     var url = window.location.href;
     console.log(url.split('='));
     var split = url.split('=')
     console.log(split[1])
     var userid = split[1];
    // return false;
     Users.sigleuser({id : userid}).then(function(res){
            console.log(res)
            $scope.code = res.data.invitecode;
     })
   
  })
 .controller('commonCtrl', function ($scope, Vendortypes,$rootScope) {
     console.log('HOney')
     console.log(Vendortypes);
     Vendortypes.all().then(function(res){
         if(res.status == true){
            for(let i in res.data){
                res.data[i].link = '/list?id='+res.data[i]._id
            }
            var divider = parseInt(res.data.length * 0.5);
            var first = res.data.slice(0,divider);
            var second = res.data.slice(divider);
            $scope.allvendortypes1 = first;
            $scope.allvendortypes2 = second;
            console.log(first, second)
         } else {
            alert("Could not load the page properly. Please reload.")
         }
         
     })
   
  });