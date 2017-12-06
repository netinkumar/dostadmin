/*
 * Vendor SignupCtrl
 * @param {type} $scope
 * @param {type} Users
 * @param {type} $timeout
 * @returns {undefined}
 */
app.controller('VendorSignupCtrl', function ($scope, Users, $timeout, $state, Vendortypes,$window, $rootScope) {
    // validations on signup
    /*
     * Form validations
     */
    $scope.user = {};
    $scope.user = {
        find_us: 'Friends'
    }
    $scope.data = {};
    $scope.message = '';
    $scope.err = '0';
    $scope.pass_msg = '';
    $timeout(function () {
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

    $scope.getallvendortypes = function(){
        Vendortypes.all().then(function(res){
            console.log(res);
            $rootScope.allvendortypes = res.data;
            $scope.data.vendor_type = $rootScope.allvendortypes[0]._id+'-'+$rootScope.allvendortypes[0].title
        })
    }
    $scope.getallvendortypes();
    $scope.signup_vendor = function () {
        var vendortype_details = $scope.data.vendor_type.split('-');
        
        this.user.vendor_type_id = vendortype_details[0];
        this.user.vendor_type = vendortype_details[1];
        
        if (Object.keys(this.user).length < 8) {
            $scope.message = "Please enter all the fields!";
            $scope.err = '1';
            return false;
        } else {
            this.user.role = 'vendor';
            this.user.status = '0';
            $scope.message = '';
            $scope.err = '0';
            console.log(this.user)
            if (this.user.password == this.user.cpassword) {
                $scope.pass_msg = '';
                $scope.err = '0';
                console.log(this.user);
                Users.homeadd(this.user).then(function (res) {
                    console.log(res);
                    if (res.status == true) {
                        $scope.user = {};
                        $scope.user_response = {};
                        $scope.success_msg = res.message;
                        $rootScope.user_id = res.data._id;
                        $window.sessionStorage.setItem('user', JSON.stringify(res.data));
                        $scope.user_response = JSON.parse($window.sessionStorage.getItem('user'));
                        var postdata = {
                            id : $scope.user_response._id,
                            phone : $scope.user_response.phone,
                            vendor_type : $scope.user_response.vendor_type
                        }
                        console.log(postdata)
                        Users.sendcode(postdata).then(function (res) {
                            console.log(res);
                            if (res.status == true) {
                                alert('Verification code has been sent your mobile number.')
                                window.location.assign(window.location.origin+'/verifycode')
                            } else {
                                $scope.error_msg = res;
                            }
                        });
                    } else {
                        $scope.error_msg = res.message;
                    }
                });
            } else {
                $scope.err = '1';
                $scope.pass_msg = 'Passwords do not match.'
            }
        }
    }

})
.controller('VerifyCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
    console.log('h')
    $scope.success_msg = '';
    $scope.data = {};
    // $rootScope.phone = JSON.parse($window.sessionStorage.getItem('user')).phone;
    $rootScope.user_id = JSON.parse($window.sessionStorage.getItem('user'))._id;
    $rootScope.vendor_type = JSON.parse($window.sessionStorage.getItem('user')).vendor_type;
   
    $scope.verify = function () {
        var postdata = {
            id: $rootScope.user_id,
            code: this.data.code,
            phone: JSON.parse($window.sessionStorage.getItem('user')).phone,
        }
        Users.verifycode(postdata).then(function (res) {
            console.log(res);
            if (res.status == true) {
                $scope.success_msg = res.data.message;
                $window.location.assign(window.location.origin+'/vendor_process')
            } else {
                $scope.error_msg = res;
            }
        });
    }
})
.controller('vendorviewCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
    console.log($rootScope.currentUser);
    $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
    //localStorage.removeItem('user');
     console.log($rootScope.currentUser);
   
})
.controller('vendordetailCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
    console.log($rootScope.currentUser);
    $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
    //localStorage.removeItem('user');
    console.log($rootScope.currentUser);
    var url = window.location.href;
    var split = url.split('=')
    var id = split[1];
    console.log(id);
    Users.sigledata({_id : id}).then(function(res){
            console.log(res);
            if(res.status == true){
                $scope.vendordetails = res.data;
                $scope.codeAddress($scope.vendordetails.location)
                 google.maps.event.addDomListener(window, 'load');
            } else {
                $scope.noresult = 1;
                $scope.message = res.message;
            }
     }) 
      
     $scope.codeAddress = function (address) {
            geocoder = new google.maps.Geocoder();
            console.log(address)
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    var myLatLng = { lat: lat, lng: lng };
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: myLatLng
                    });
                    var marker = new google.maps.Marker({
                        draggable: false,
                        position: myLatLng,
                        map: map,
                    })
                    google.maps.event.addListener(marker, 'dragend', function () {
                        geocodePosition(marker.getPosition());
                    });
                }
                else {
                    //alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
   
})
.controller('aboutusCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
    if(sessionStorage.getItem('user') != null || sessionStorage.getItem('user') != undefined){
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
    } else {
        $rootScope.currentUser = null;
    }
   
})

.controller('postjobCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
  
    if(sessionStorage.getItem('user') != null || sessionStorage.getItem('user') != undefined){
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
    } else {
        $rootScope.currentUser = null;
    }
    
  
   
})
.controller('vendorlistCtrl', function ($scope, Users, $timeout, $state, $window, $rootScope) {
     $scope.vendor_name = {};
    if(sessionStorage.getItem('user') != null || sessionStorage.getItem('user') != undefined){
            $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
    } else {
        $rootScope.currentUser = null;
    }
   
    $scope.noresult = 0;
    $scope.message = '';
    $scope.vendorlist = {};
     var url = window.location.href;
     var split = url.split('=')
     var vendor_type = split[1];
     if(vendor_type == 'photographer'){ vendor_type = 'Photographer'};
     if(vendor_type == 'venue'){ vendor_type = 'Wedding Venue'};
     if(vendor_type == 'makeup'){ vendor_type = 'Make Up'};
     if(vendor_type == 'groomwear'){ vendor_type = 'Groomwear'};
     if(vendor_type == 'mehandi'){ vendor_type = 'Mehndi Artist'};
     if(vendor_type == 'cake'){ vendor_type = 'Wedding Cake'};
     if(vendor_type == 'jewellery'){ vendor_type = 'Wedding Jewellery'};
     if(vendor_type == 'catering'){ vendor_type = 'Wedding Catering'};
     if(vendor_type == 'bridal'){ vendor_type = 'Bridal Wear'};
     if(vendor_type == 'decorator'){ vendor_type = 'Wedding Decorator'};
     if(vendor_type == 'planner'){ vendor_type = 'Wedding Planner'};
     if(vendor_type == 'cards'){ vendor_type = 'Wedding Cards'};
     if(vendor_type == 'entertainment'){ vendor_type = 'Wedding Entertainment'};
     if(vendor_type == 'sangeet'){ vendor_type = 'Sangeet Choreographer'};
     if(vendor_type == 'accessories'){ vendor_type = 'Wedding Accessories'};
     if(vendor_type == 'all'){ vendor_type = 'All vendors'};
     $scope.vendor_name = vendor_type;

     if($scope.vendor_name == 'All vendors'){
        Users.getallvendors({role : 'Vendor', page : 1}).then(function(res){
               console.log(res);
               if(res.status == true){
                   $scope.vendorlist = res.data;
               } else {
                   $scope.noresult = 1;
                   $scope.message = res.message;
               }
        })
     } else {
        Users.getvendorbytype({vendor_type : vendor_type}).then(function(res){
               console.log(res);
               if(res.status == true){
                   $scope.vendorlist = res.data;
               } else {
                   $scope.noresult = 1;
                   $scope.message = res.message;
               }
        })
     }
   
     $scope.vendorDetails = function(type, id){
         console.log(type, id);
         window.location.assign(window.location.origin+'/vendor_detail?id='+id)
       
     }
   
})
app.controller('changepasswordCtrl', function ($scope, $timeout, Users, $window, $rootScope) {
    if (sessionStorage.getItem('user') == null || sessionStorage.getItem('user') == undefined) {
        $rootScope.currentUser = null;

    } else {
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('user'));
        $rootScope.salt = $rootScope.currentUser.salt
    }
        $scope.changepassword = function (user) {
            // console.log(user);
            if (!user) {
                $scope.error_msg = "Please enter password && confirm password";
                return false;
            } else if (!user.password) {
                $scope.error_msg = "Please enter password!";
                return false;
            } else if (!user.confirmpassword) {
                $scope.error_msg = "Please enter confirm password!";
                return false;
            }
            else if (user.password != user.confirmpassword) {
                $scope.error_msg = "Passwords do not match.";
                return false;
            }
            var user1 = JSON.parse(sessionStorage.getItem('user'));
            var postdata = {
                id: user1._id,
                password: user.password,
                salt: user1.salt
            }
            console.log(user);
            if ($rootScope.currentUser != null) {
                Users.resetpwd(postdata).then(function (res) {
                    if (res.status == true) {
                        $scope.success_msg = res.message;
                    } else {
                        $scope.error_msg = res.message;
                    }
                });
            } else {
                return false;
            }
    }
})

.controller('VendorProcessCtrl', function ($scope, Users, $state, $rootScope, $window) {
        // $rootScope.$emit('rootScope:emit', 'Emit!')
       
       // $rootScope.currentUser = JSON.parse($window.sessionStorage.getItem('user'));
        $rootScope.user_id = JSON.parse($window.sessionStorage.getItem('user'))._id;
        $rootScope.vendor_type = JSON.parse($window.sessionStorage.getItem('user')).vendor_type;
        $rootScope.company_name = JSON.parse($window.sessionStorage.getItem('user')).company_name;
        $rootScope.phone = JSON.parse($window.sessionStorage.getItem('user')).phone;
        console.log($rootScope.vendor_type)
        $scope.fb_link = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D'+$rootScope.user_id
        $scope.google_link = 'https://plus.google.com/share?url=http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D'+$rootScope.user_id
        //http://wedding-dost.us-east-1.elasticbeanstalk.com/invitationcode?code=" + userid
        //http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D
        // map options starts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, err);
        } else {
            alert('Could not get your location');
        }
        function geoSuccess(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            // alert("lat:" + lat + " lng:" + lng);
            var myLatLng = { lat: lat, lng: lng };

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: myLatLng
            });

            var marker = new google.maps.Marker({
                draggable: true,
                position: myLatLng,
                map: map,
            })
            google.maps.event.addListener(marker, 'dragend', function () {
                geocodePosition(marker.getPosition());
            });
        }
        function err(err) {
            console.log(err)
        }
        function geocodePosition(pos) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode
                ({
                    latLng: pos
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results[0].formatted_address);
                        $scope.user.location = results[0].formatted_address;
                        console.log($scope.user.location)
                        $("#mapSearchInput").val(results[0].formatted_address);
                        $("#mapErrorMsg").hide(100);
                    }
                    else {
                        $("#mapErrorMsg").html('Cannot determine address at this location.' + status).show(100);
                    }
                }
                );
        };
        google.maps.event.addDomListener(window, 'load', initialize);
        function initialize() {
            var address = (document.getElementById('mapSearchInput'));
            var autocomplete = new google.maps.places.Autocomplete(address);
            autocomplete.setTypes(['geocode']);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
            });
        }
        $scope.codeAddress = function () {
            geocoder = new google.maps.Geocoder();
            var address = document.getElementById("mapSearchInput").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    var myLatLng = { lat: lat, lng: lng };
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: myLatLng
                    });
                    var marker = new google.maps.Marker({
                        draggable: true,
                        position: myLatLng,
                        map: map,
                    })
                    google.maps.event.addListener(marker, 'dragend', function () {
                        geocodePosition(marker.getPosition());
                    });
                }
                else {
                    //alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
        // map options end



        $scope.user = {};
        $scope.addon = {};
        $scope.data = {};
        $scope.data1 = {};
        $scope.gallary = [];
        $scope.loading = false;
        $scope.fields = [];
        $scope.moreAddon = [];
        $scope.moreHigh = [];
        $scope.discount = '2';
        $scope.showdiscount = 1; // show input on entering the page
        $scope.custom_dis = 0; //
        $scope.disc = {};
        // bridal //groom
        $scope.bridal = {}; //for highlights
        $scope.groom = {}; // for addons

        $scope.additionalservices = function () {
            $scope.fields.push(Math.random());
        }
        $scope.uploadFile = function (input) {
            $scope.loading = true;
            Users.uploadgallary(input.files[0]).then(function (res) {
                console.log(res[0].location);
                $scope.loading = false;
                if (res) {
                    $scope.imgshow = res[0].location;
                    console.log($scope.imgshow)
                    $scope.gallary.push({ 'image': $scope.imgshow });
                    console.log($scope.gallary)
                }
            });
        };
        $scope.removeImage = function (index) {
            console.log(index)
            $scope.gallary.splice(index, 1);
            console.log($scope.gallary)
        }
        $scope.add_addon = function () {
            var title = $scope.data.more_title;
            var price = $scope.data.more_price;
            var newadds = {
                title: title,
                price: price
            }
            console.log(newadds)
            if (price != undefined  && price != '') {
                if (title != undefined && title != ''){

                 $scope.moreAddon.push(newadds); 
                   
                    $scope.data = {};
                } else {
                      alert('Please enter a value')
                }
            } else {
                alert('Please enter a value')
            }
            console.log($scope.moreAddon);
            console.log($scope.addon);
        }

        $scope.check = function (event, model) {
            console.log(event.target.checked, model)
            if (event.target.checked == false) {
                if (model == 'candid') {
                    this.groom.candid = '';
                } else if (model == 'video_editing') {
                    this.groom.video_editing = '';
                } else if (model == 'portrait') {
                    this.groom.portrait = '';
                } else if (model == 'photo_book') {
                    this.groom.photo_book = '';
                } else if (model == 'delivery_addon') {
                    $scope.groom.delivery_addon = '';
                } else if (model == 'inhouse_addon') {
                    $scope.groom.inhouse_addon = '';
                } else if (model == 'tailoring_addon') {
                    $scope.groom.tailoring_addon = '';
                } else if (model == 'designing_addon') {
                    $scope.groom.designing_addon = '';
                } else if (model == 'maching_addon') {
                    $scope.groom.maching_addon = '';
                } else if (model == 'air_addon') {
                    $scope.groom.air_addon = '';
                } else if (model == 'travel_addon') {
                    $scope.groom.travel_addon = '';
                } else if (model == 'delivery1_addon') {
                    $scope.groom.delivery1_addon = '';
                } else if (model == 'design_addon') {
                    $scope.groom.design_addon = '';
                } else if (model == 'demo_addon') {
                    $scope.groom.demo_addon = '';
                } else if (model == 'non_veg') {
                    $scope.groom.non_veg = '';
                } else if (model == 'healthy_addon') {
                    $scope.groom.healthy_addon = '';
                } else if (model == 'hallal_addon') {
                    $scope.groom.hallal_addon = '';
                } else if (model == 'onion_addon') {
                    $scope.groom.onion_addon = '';
                } else if (model == 'garlic_addon') {
                    $scope.groom.garlic_addon = '';
                } else if (model == 'sound_addon') {
                    $scope.groom.sound_addon = '';
                } else if (model == 'lighting_addon') {
                    $scope.groom.lighting_addon = '';
                } else if (model == 'security_addon') {
                    $scope.groom.security_addon = '';
                } else if (model == 'cocktail_addon') {
                    $scope.groom.cocktail_addon = '';
                }

                for (let i in $scope.moreAddon) {
                    if ($scope.moreAddon[i].title == model) {
                        $scope.moreAddon.splice(i, 1);
                        console.log($scope.moreAddon);
                    }
                }
            }
        };

        $scope.check_high = function (event, model) {
            console.log(event.target.checked, model)
            if (event.target.checked == false) { // bridal is used for highlights
                if (model == 'candid_high') {
                    this.bridal.candid_high = '';
                } else if (model == 'videoediting_high') {
                    this.bridal.videoediting_high = '';
                } else if (model == 'portrait_high') {
                    this.bridal.portrait_high = '';
                } else if (model == 'photobook_high') {
                    this.bridal.photobook_high = '';
                } else if (model == 'travel') {
                    $scope.bridal.travel1 = ''
                } else if (model == 'bulkdisc_travel') {
                    $scope.bridal.bulkdisc_travel = ''
                } else if (model == 'home_delivery') {
                    $scope.bridal.home_delivery = ''
                } else if (model == 'theme_high') {
                    $scope.bridal.theme_high = '';
                } else if (model == 'continental_high') {
                    $scope.bridal.continental_high = '';
                } else if (model == 'healthy_high') {
                    $scope.bridal.healthy_high = '';
                } else if (model == 'allergy_high') {
                    $scope.bridal.allergy_high = '';
                } else if (model == 'pool_high') {
                    $scope.bridal.pool_high = '';
                } else if (model == 'outdoor_high') {
                    $scope.bridal.outdoor_high = '';
                } else if (model == 'nearcity_high') {
                    $scope.bridal.nearcity_high = '';
                } else if (model == 'nearaiport_high') {
                    $scope.bridal.nearaiport_high = '';
                } else if (model == 'bar_high') {
                    $scope.bridal.bar_high = '';
                } else if (model == 'mandap_high') {
                    $scope.bridal.mandap_high = '';
                } else if (model == 'dj_high') {
                    $scope.bridal.dj_high = '';
                }
                for (let i in $scope.moreHigh) {
                    if ($scope.moreHigh[i].title == model) {
                        $scope.moreHigh.splice(i, 1);
                        console.log($scope.moreHigh);
                    }
                }
            }
        };
        $scope.showDiscountOption = function (value) {
            console.log(value);
             $scope.showdiscount = 1;
            $scope.discount = value;
            if ($scope.discount == 'custom') {
                $scope.custom_dis = 1;
            } else {
                $scope.custom_dis = 0;
            }
        };
        $scope.save_discount = function () {
            console.log($scope.disc)
            console.log($scope.disc)
            // if ($scope.disc.days == undefined || $scope.disc.days == '') {
            //     alert('Please Enter Days')
            // } else {
                if ($scope.disc.title == undefined || $scope.disc.title == '') {
                      alert('Please Enter A Tilte')
                } else {
                    if ($scope.disc.amount == undefined || $scope.disc.amount == '') {
                         alert('Please Enter An Amount')
                    } else {
                        if ($scope.discount == 'custom') {
                            $scope.user.discount = {
                                days: $scope.disc.days,
                                title: $scope.disc.title,
                                amount: $scope.disc.amount
                            }
                        } else {
                            $scope.user.discount = {
                                days: $scope.discount,
                                title: $scope.disc.title,
                                amount: $scope.disc.amount
                            }
                        }
                        $scope.addeddiscount = 1;
                        $scope.showdiscount = 0;
                        $scope.custom_dis = 0;
                        alert('Added Successfully!')
                    }
                }
            // }
           
        }

        $scope.add_highlight = function () {
            $scope.vendordata = {};

            var title = $scope.data1.more_title;
            var price = $scope.data1.more_price;
            var newadds = {
                title: title,
                price: price
            }
            console.log(newadds)
            if (price != undefined && price != '') {
                if (title != undefined && title != '') {
                    $scope.moreHigh.push(newadds);
                    $scope.data1 = {};
                } else {
                    alert('Please enter a value')
                }
            } else {
                alert('Please enter a value')
            }
            console.log($scope.moreHigh);
        }

        $scope.vendor_process = function (user) {
            console.log($scope.groom)
            console.log($scope.moreHigh);
            console.log($scope.user.location)
            if ($scope.user.location != undefined) {
                $scope.vendordata = {};
                if ($scope.user.deals == undefined) {
                    $scope.user.deals = {};
                    $scope.user.deals.amount = '';
                    $scope.user.deals.effect_date = '';
                    $scope.user.deals.pro_details = '';
                }
                if ($scope.user.facebook_username == undefined){ $scope.user.facebook_username = '' };
                if ($scope.user.instagram_username == undefined){ $scope.user.instagram_username = '' };
                if ($scope.user.twitter_username == undefined){ $scope.user.twitter_username = '' };
                if (this.groom.candid == undefined) {
                    this.groom.candid = '';
                }
                if (this.groom.video_editing == undefined) {
                    this.groom.video_editing = '';
                }
                if (this.groom.portrait == undefined) {
                    this.groom.portrait = '';
                }
                if (this.groom.photo_book == undefined) {
                    this.groom.photo_book = '';
                }
                if (this.bridal.candid_high == undefined) {
                    this.bridal.candid_high = '';
                }
                if (this.bridal.videoediting_high == undefined) {
                    this.bridal.videoediting_high = '';
                }
                if (this.bridal.portrait_high == undefined) {
                    this.bridal.portrait_high = '';
                }
                if ($scope.user.discount == undefined) {
                    $scope.user.discount = '';
                }

                if ($scope.bridal.travel1 == undefined) {
                    $scope.bridal.travel1 = '';
                }
                if ($scope.bridal.design == undefined) {
                    $scope.bridal.design = '';
                }
                if ($scope.bridal.bulkdisc_travel == undefined) {
                    $scope.bridal.bulkdisc_travel = '';
                }
                if ($scope.bridal.home_delivery == undefined) {
                    $scope.bridal.home_delivery = '';
                }
                if ($scope.groom.delivery_addon == undefined) {
                    $scope.groom.delivery_addon = ''
                }
                if ($scope.groom.inhouse_addon == undefined) {
                    $scope.groom.inhouse_addon = ''
                }
                if ($scope.groom.tailoring_addon == undefined) {
                    $scope.groom.tailoring_addon = ''
                } if ($scope.groom.designing_addon == undefined) {
                    $scope.groom.designing_addon = ''
                } if ($scope.groom.maching_addon == undefined) {
                    $scope.groom.maching_addon = ''
                } if ($scope.bridal.theme_high == undefined) {
                    $scope.bridal.theme_high = '';
                } if ($scope.groom.air_addon == undefined) {
                    $scope.groom.air_addon = ''
                } if ($scope.groom.travel_addon == undefined) {
                    $scope.groom.travel_addon = ''
                } if ($scope.groom.delivery1_addon == undefined) {
                    $scope.groom.delivery1_addon = ''
                } if ($scope.groom.demo_addon == undefined) {
                    $scope.groom.demo_addon = ''
                } if ($scope.groom.design_addon == undefined) {
                    $scope.groom.design_addon = ''
                } if ($scope.groom.sound_addon == undefined) {
                    $scope.groom.sound_addon = '';
                } if ($scope.groom.lighting_addon == undefined) {
                    $scope.groom.lighting_addon = '';
                } if ($scope.groom.security_addon == undefined) {
                    $scope.groom.security_addon = '';
                } if ($scope.groom.cocktail_addon == undefined) {
                    $scope.groom.cocktail_addon = '';
                } if ($scope.groom.nonveg_addon == undefined) {
                    $scope.groom.nonveg_addon = ''
                } if ($scope.groom.healthy_addon == undefined) {
                    $scope.groom.healthy_addon = ''
                } if ($scope.groom.hallal_addon == undefined) {
                    $scope.groom.hallal_addon = ''
                } if ($scope.groom.onion_addon == undefined) {
                    $scope.groom.onion_addon = ''
                } if ($scope.groom.garlic_addon == undefined) {
                    $scope.groom.garlic_addon = ''
                } if ($scope.bridal.continental_high == undefined) {
                    $scope.bridal.continental_high = ''
                } if ($scope.bridal.allergy_high == undefined) {
                    $scope.bridal.allergy_high = ''
                } if ($scope.bridal.healthy_high == undefined) {
                    $scope.bridal.healthy_high = ''
                }
                if ($scope.bridal.pool_high == undefined) {
                    $scope.bridal.pool_high = ''
                } if ($scope.bridal.outdoor_high == undefined) {
                    $scope.bridal.outdoor_high = ''
                } if ($scope.bridal.nearcity_high == undefined) {
                    $scope.bridal.nearcity_high = ''
                } if ($scope.bridal.nearaiport_high == undefined) {
                    $scope.bridal.nearaiport_high = ''
                } if ($scope.bridal.bar_high == undefined) {
                    $scope.bridal.bar_high = ''
                } if ($scope.bridal.mandap_high == undefined) {
                    $scope.bridal.mandap_high = ''
                } if ($scope.bridal.dj_high == undefined) {
                    $scope.bridal.dj_high = ''
                }
                if($scope.user.about_us == undefined){
                    $scope.user.about_us = '';
                }


                if ($rootScope.vendor_type == 'Photographer') {
                    $scope.user_addon = {
                        candid: this.groom.candid,
                        video_editing: this.groom.video_editing,
                        portrait: this.groom.portrait,
                        photo_book: this.groom.photo_book,
                    }

                    $scope.user_highlight = {
                        candid_high: this.bridal.candid_high,
                        videoediting_high: this.bridal.videoediting_high,
                        portrait_high: this.bridal.portrait_high,
                        photobook_high: this.bridal.photobook_high,
                    }
                } else if ($rootScope.vendor_type == 'Make Up' || $rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {
                    $scope.user_highlight = {
                        travel: $scope.bridal.travel1,
                        bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                        home_delivery: $scope.bridal.home_delivery,
                        design_customization: $scope.bridal.design
                    }
                    console.log($scope.user_highlight);

                    if ($rootScope.vendor_type == 'Make Up') {
                        $scope.user_addon = {
                            air_brush: $scope.groom.air_addon,
                            travel: $scope.groom.travel_addon
                        }
                    } else if ($rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {

                        $scope.user_addon = {
                            delivery: $scope.groom.delivery_addon,
                            inhouse: $scope.groom.inhouse_addon,
                            tailoring: $scope.groom.tailoring_addon,
                            designing: $scope.groom.designing_addon,
                            maching: $scope.groom.maching_addon
                        };
                    }
                } else if ($rootScope.vendor_type == 'Sangeet Choreographer' || $rootScope.vendor_type == 'Mehandi Artist' || $rootScope.vendor_type == 'Wedding Cake' || $rootScope.vendor_type == 'Wedding Entertainment' || $rootScope.vendor_type == 'Wedding Cards' || $rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {

                    if ($rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {
                        $scope.user_highlight = {
                            theme_high: $scope.bridal.theme_high,
                        }
                    } else {
                        $scope.user_highlight = {
                            travel: $scope.bridal.travel1,
                            bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                            home_delivery: $scope.bridal.home_delivery,
                            design_customization: $scope.bridal.design
                        }
                    }
                    $scope.user_addon = '';
                } else if ($rootScope.vendor_type == 'Wedding Jewellery' || $rootScope.vendor_type == 'Wedding Accessories') {
                    $scope.user_addon = {
                        delivery: $scope.groom.delivery_addon,
                        inhouse: $scope.groom.inhouse_addon,
                        custom_dis: $scope.groom.tailoring_addon,
                    };
                    $scope.user_highlight = {
                        travel: $scope.bridal.travel1,
                        bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                        home_delivery: $scope.bridal.home_delivery,
                        design_customization: $scope.bridal.design
                    }
                } else if ($rootScope.vendor_type == 'Wedding Catering') {
                    $scope.user_addon = {
                        non_veg: $scope.groom.nonveg_addon,
                        healthy: $scope.groom.healthy_addon,
                        hallal: $scope.groom.hallal_addon,
                        wo_onion: $scope.groom.onion_addon,
                        wo_garlic: $scope.groom.garlic_addon,
                    };
                    $scope.user_highlight = {
                        continental: $scope.bridal.continental_high,
                        allergy: $scope.bridal.allergy_high,
                        healthy: $scope.bridal.healthy_high
                    }
                } else if ($rootScope.vendor_type == 'Wedding Venue') {
                    $scope.user_addon = {
                        sound: $scope.groom.sound_addon,
                        lighting: $scope.groom.lighting_addon,
                        security: $scope.groom.security_addon,
                        cocktail: $scope.groom.cocktail_addon,
                    };
                    $scope.user_highlight = {
                        outdoor: $scope.bridal.outdoor_high,
                        nearcity: $scope.bridal.nearcity_high,
                        nearairpot: $scope.bridal.nearaiport_high,
                        bar: $scope.bridal.bar_high,
                        mandap: $scope.bridal.mandap_high,
                        dj: $scope.bridal.dj_high,
                        pool: $scope.bridal.pool_high,
                    }
                }


                $scope.user.addon = $scope.user_addon;
                
                for(let i in $scope.moreAddon){
                    if($scope.moreAddon[i].$$hashKey){
                            delete $scope.moreAddon[i].$$hashKey
                    }
                    
                }
                for(let i in $scope.moreHigh){
                    if($scope.moreHigh[i].$$hashKey){
                            delete $scope.moreHigh[i].$$hashKey
                    }
                    
                }
                for (let i in $scope.gallary) {
                    if ($scope.gallary[i].$$hashKey) {
                        delete $scope.gallary[i].$$hashKey
                    }
                }
                $scope.user.additional_addons = $scope.moreAddon;
              
                $scope.user.additional_highlight = $scope.moreHigh;
                $scope.user.highlight = $scope.user_highlight;

                if ($scope.user.additionalservice == undefined) {
                    $scope.user.additionalservice = '';
                }
                var postdata = {
                    id: $rootScope.user_id,
                    establishment_year: $scope.user.establishment_year,
                    sworking_hours: $scope.user.start_hours,
                    eworking_hours: $scope.user.end_hours,
                    facebook_username: $scope.user.facebook_username,
                    twitter_username: $scope.user.twitter_username,
                    instagram_username: $scope.user.instagram_username,
                    location: $scope.user.location,
                    email: $scope.user.email,
                    discount_amount: $scope.user.deals.amount,
                    effective_date: $scope.user.deals.effect_date,
                    product_detail: $scope.user.deals.pro_details,
                    awards: $scope.user.awards,
                    vendor_type : $rootScope.vendor_type,
                    phone : $rootScope.phone,
                    company_name : $rootScope.company_name,
                    about_us : $scope.user.about_us,
                    // maximum_guest: data.value.maxguest,
                    //  minimum_guest: data.value.minguest,
                    additional_addon: JSON.stringify($scope.user.additional_addons),
                    addon: JSON.stringify($scope.user.addon),
                    highlights: JSON.stringify($scope.user.highlight),
                    discount:JSON.stringify( $scope.user.discount),
                    gallery: JSON.stringify(this.gallary),
                    additional_highlights: JSON.stringify($scope.user.additional_highlight),
                    //  photo_vedio: JSON.stringify(this.photovedio),
                    additional_discounts : 'undefined',
                    // additional_photo_vedio: JSON.stringify(this.items1),
                    //  additional_discounts: JSON.stringify(this.morediscount),
                    //  price_per_plate: JSON.stringify(this.price_per_plate),
                    additionalservices: JSON.stringify($scope.user.additionalservice),
                    services: JSON.stringify($scope.user.service)
                }

                // user.addon = JSON.parse(req.body.addon);
                // user.highlights = JSON.parse(req.body.highlights);
                // user.discount = JSON.parse(req.body.discount);
                // user.gallery_image = JSON.parse(req.body.gallery);
                // if (req.body.additional_addon.length > 0) {
                //     user.additional_addon = JSON.parse(req.body.additional_addon);
                // }
                // if (req.body.additional_highlights.length > 0) {
                //     user.additional_highlights = JSON.parse(req.body.additional_highlights);
                // }
                // if (req.body.additional_discounts != 'undefined') {
                //     user.additional_discounts = JSON.parse(req.body.additional_discounts);

                console.log(postdata)
                // return false;
                Users.saveinfo(postdata).then(function (res) {
                    console.log(res);
                    if (res.status == true) {
                        $scope.success_msg = res.message;
                        alert(res.message)
                        $window.sessionStorage.clear();
                        $window.location.assign('http://hunny-env-1.sfftrpytm8.us-east-1.elasticbeanstalk.com/signin')
                       
                    } else {
                        $scope.error_msg = res;
                    }
                });
            }
        }
    })

    .controller('editbasicinfoCtrl', function ($scope, Users, $state, $rootScope, $window) {
        // $rootScope.$emit('rootScope:emit', 'Emit!')
        $scope.fb_link = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D'+$rootScope.user_id
        $scope.google_link = 'https://plus.google.com/share?url=http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D'+$rootScope.user_id
        $scope.email_link = 'mailto:?subject=I wanted you to see this site&amp;body=Check out : http://wedding-dost.us-east-1.elasticbeanstalk.com/invitationcode?code="'+$rootScope.user_id
        //http://wedding-dost.us-east-1.elasticbeanstalk.com/invitationcode?code=" + userid
        //http%3A%2F%2Fwedding-dost.us-east-1.elasticbeanstalk.com%2Finvitationcode%3Fcode%3D
        // map options starts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, err);
        } else {
            alert('Could not get your location');
        }
        function geoSuccess(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            // alert("lat:" + lat + " lng:" + lng);
            var myLatLng = { lat: lat, lng: lng };

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: myLatLng
            });

            var marker = new google.maps.Marker({
                draggable: true,
                position: myLatLng,
                map: map,
            })
            google.maps.event.addListener(marker, 'dragend', function () {
                geocodePosition(marker.getPosition());
            });
        }
        function err() {
            console.log(err)
        }
        function geocodePosition(pos) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode
                ({
                    latLng: pos
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results[0].formatted_address);
                        $scope.user.location = results[0].formatted_address;
                        console.log($scope.user.location)
                        $("#mapSearchInput").val(results[0].formatted_address);
                        $("#mapErrorMsg").hide(100);
                    }
                    else {
                        $("#mapErrorMsg").html('Cannot determine address at this location.' + status).show(100);
                    }
                }
                );
        };
        google.maps.event.addDomListener(window, 'load', initialize);
        function initialize() {
            var address = (document.getElementById('mapSearchInput'));
            var autocomplete = new google.maps.places.Autocomplete(address);
            autocomplete.setTypes(['geocode']);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
            });
        }
        $scope.codeAddress = function () {
            geocoder = new google.maps.Geocoder();
            var address = document.getElementById("mapSearchInput").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    var myLatLng = { lat: lat, lng: lng };
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: myLatLng
                    });
                    var marker = new google.maps.Marker({
                        draggable: true,
                        position: myLatLng,
                        map: map,
                    })
                    google.maps.event.addListener(marker, 'dragend', function () {
                        geocodePosition(marker.getPosition());
                    });
                }
                else {
                    //alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
        // map options end
      
        
        //fetch user data

        $scope.user = {};
        $scope.addon = {};
        $scope.data = {};
        $scope.data1 = {};
        $scope.fields = [];
        $scope.moreAddon = []; $scope.moreAddon1 = []; $scope.moreAddon2 = []; $scope.moreAddon3 = [];
        $scope.moreAddon4 = []; $scope.moreAddon5 = []; $scope.moreAddon6 = [];
        $scope.moreHigh = [];
        $scope.gallary = [];
        $scope.discount = "";
        $scope.disc = {};
        $scope.loading = false;
        // bridal //groom
        $scope.bridal = {}; //for highlights
        $scope.groom = {}; // for addons

        $rootScope.currentUser = JSON.parse($window.sessionStorage.getItem('user'));
        $rootScope.user_id = JSON.parse($window.sessionStorage.getItem('user'))._id;
        $rootScope.vendor_type = JSON.parse($window.sessionStorage.getItem('user')).vendor_type;
        $rootScope.saved_vendor_type = JSON.parse($window.sessionStorage.getItem('user')).vendor_type; 
        // to check the dynamic fields
        $rootScope.company_name = JSON.parse($window.sessionStorage.getItem('user')).company_name;
        $rootScope.phone = JSON.parse($window.sessionStorage.getItem('user')).phone;
        $scope.gallary = $rootScope.currentUser.gallery_image
        if($scope.gallary == undefined){
              $scope.gallary = [];
        }

        
        $scope.user_addon = $rootScope.currentUser.addon;
        if($rootScope.currentUser.discount != undefined) {
            $scope.discount = $rootScope.currentUser.discount.days;
            $scope.disc = {
                days: $rootScope.currentUser.discount.days,
                title: $rootScope.currentUser.discount.title,
                amount: $rootScope.currentUser.discount.amount
            }
        } else {
            
        }
       
        if($scope.disc.days != '2'){
            $scope.discount = 'custom';
        }
        console.log( $scope.disc);

        if ($rootScope.vendor_type == 'Photographer') {
            $scope.moreAddon = $rootScope.currentUser.additional_addon; // add-on
        } else if ($rootScope.vendor_type == 'Make Up' || $rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {
        
            if ($rootScope.vendor_type == 'Make Up') {
                $scope.moreAddon1 = $rootScope.currentUser.additional_addon;  // add-on1
            } else {
                    $scope.moreAddon4 = $rootScope.currentUser.additional_addon;  // add-on4
            }
        } else if ($rootScope.vendor_type == 'Sangeet Choreographer' || $rootScope.vendor_type == 'Mehandi Artist' || $rootScope.vendor_type == 'Wedding Cake' || $rootScope.vendor_type == 'Wedding Entertainment' || $rootScope.vendor_type == 'Wedding Cards' || $rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {
            $scope.moreAddon2 = $rootScope.currentUser.additional_addon;  // add-on2
        } else if ($rootScope.vendor_type == 'Wedding Jewellery' || $rootScope.vendor_type == 'Wedding Accessories') {
            $scope.moreAddon3 = $rootScope.currentUser.additional_addon;  // add-on3
        } else if ($rootScope.vendor_type == 'Wedding Catering') {
            $scope.moreAddon5 = $rootScope.currentUser.additional_addon;  // add-on5
        } else if ($rootScope.vendor_type == 'Wedding Venue') {
            $scope.moreAddon6 = $rootScope.currentUser.additional_addon;  
        }
       
        $scope.uploadFile = function (input) {
            $scope.loading = true;
            Users.uploadgallary(input.files[0]).then(function (res) {
                console.log(res[0].location);
                $scope.loading = false;
                if (res) {
                    $scope.imgshow = res[0].location;
                    console.log($scope.imgshow)
                    $scope.gallary.push({'image' : $scope.imgshow});
                     console.log($scope.gallary)
                }
            });
        };
        $scope.removeImage = function(index){
            console.log(index)
            $scope.gallary.splice(index, 1);
            console.log($scope.gallary)
        }
        console.log($scope.moreAddon4)
        if ($rootScope.vendor_type == 'Photographer') {
            $scope.groom = {
                candid: $rootScope.currentUser.addon.candid,
                video_editing:  $rootScope.currentUser.addon.video_editing,
                portrait:  $rootScope.currentUser.addon.portrait,
                photo_book:  $rootScope.currentUser.addon.photo_book,
            }

            $scope.bridal = {
                candid_high: $rootScope.currentUser.highlights.candid_high,
                videoediting_high: $rootScope.currentUser.highlights.videoediting_high,
                portrait_high: $rootScope.currentUser.highlights.portrait_high,
                photobook_high: $rootScope.currentUser.highlights.photobook_high,
            }
        } else if ($rootScope.vendor_type == 'Make Up' || $rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {
            $scope.user_highlight = {
                travel: $rootScope.currentUser.highlights.travel1,
                bulkdisc_travel: $rootScope.currentUser.highlights.bulkdisc_travel,
                home_delivery: $rootScope.currentUser.highlights.home_delivery,
                design_customization: $rootScope.currentUser.highlights.design
            }
            console.log($scope.user_highlight);

            if ($rootScope.vendor_type == 'Make Up') {
                $scope.groom = {
                    air_addon: $scope.groom.air_brush,
                    travel_addon: $scope.groom.travel_addon
                }
            } else if ($rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {

                $scope.groom = {
                    delivery_addon: $rootScope.currentUser.addon.delivery,
                    inhouse_addon:  $rootScope.currentUser.addon.inhouse,
                    tailoring_addon:  $rootScope.currentUser.addon.tailoring,
                    designing_addon:  $rootScope.currentUser.addon.designing,
                    maching_addon:  $rootScope.currentUser.addon.maching
                };
                if($scope.groom.delivery_addon != ''){
                    $scope.delivery_addon_check = true;
                  var myEl = angular.element(document.querySelector('#delivery_addon_id'));
                   console.log(myEl)
                   myEl.css('display', 'block !important;');
                   console.log(myEl);
                   
                    // alert('h')
                } 
              
            }
        } else if ($rootScope.vendor_type == 'Sangeet Choreographer' || $rootScope.vendor_type == 'Mehandi Artist' || $rootScope.vendor_type == 'Wedding Cake' || $rootScope.vendor_type == 'Wedding Entertainment' || $rootScope.vendor_type == 'Wedding Cards' || $rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {
            if ($rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {
                $scope.user_highlight = {
                    theme_high: $scope.bridal.theme_high,
                }
            } else {
                $scope.user_highlight = {
                    travel: $scope.bridal.travel1,
                    bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                    home_delivery: $scope.bridal.home_delivery,
                    design_customization: $scope.bridal.design
                }
            }
            $scope.user_addon = '';
        } else if ($rootScope.vendor_type == 'Wedding Jewellery' || $rootScope.vendor_type == 'Wedding Accessories') {
            $scope.user_addon = {
                delivery: $scope.groom.delivery_addon,
                inhouse: $scope.groom.inhouse_addon,
                custom_dis: $scope.groom.tailoring_addon,
            };
            $scope.user_highlight = {
                travel: $scope.bridal.travel1,
                bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                home_delivery: $scope.bridal.home_delivery,
                design_customization: $scope.bridal.design
            }
        } else if ($rootScope.vendor_type == 'Wedding Catering') {
            $scope.user_addon = {
                non_veg: $scope.groom.nonveg_addon,
                healthy: $scope.groom.healthy_addon,
                hallal: $scope.groom.hallal_addon,
                wo_onion: $scope.groom.onion_addon,
                wo_garlic: $scope.groom.garlic_addon,
            };
            $scope.user_highlight = {
                continental: $scope.bridal.continental_high,
                allergy: $scope.bridal.allergy_high,
                healthy: $scope.bridal.healthy_high
            }
        } else if ($rootScope.vendor_type == 'Wedding Venue') {
            $scope.user_addon = {
                sound: $scope.groom.sound_addon,
                lighting: $scope.groom.lighting_addon,
                security: $scope.groom.security_addon,
                cocktail: $scope.groom.cocktail_addon,
            };
            $scope.user_highlight = {
                outdoor: $scope.bridal.outdoor_high,
                nearcity: $scope.bridal.nearcity_high,
                nearairpot: $scope.bridal.nearaiport_high,
                bar: $scope.bridal.bar_high,
                mandap: $scope.bridal.mandap_high,
                dj: $scope.bridal.dj_high,
                pool: $scope.bridal.pool_high,
            }
        }
        $scope.moreHigh =  $rootScope.currentUser.additional_highlights;
        
       
        console.log($scope.bridal)
        $scope.user = {
            vendor_type : $rootScope.vendor_type,
            about_us : $rootScope.currentUser.about_us,
            establishment_year : $rootScope.currentUser.establishment_year,
            facebook_username :  $rootScope.currentUser.facebook_username,
            twitter_username : $rootScope.currentUser.twitter_username,
            instagram_username :$rootScope.currentUser.instagram_username,
            email : $rootScope.currentUser.email,
            company_name : $rootScope.currentUser.company_name,
            location : $rootScope.currentUser.location,
            phone : $rootScope.currentUser.phone,
            address : $rootScope.currentUser.address,
            service : $rootScope.currentUser.services,
            start_hours : $rootScope.currentUser.sworking_hours,
            end_hours : $rootScope.currentUser.eworking_hours,
            awards : $rootScope.currentUser.awards
        }
         $scope.user.deals = {
           amount : $rootScope.currentUser.discount_amount,
           effect_date : $rootScope.currentUser.effective_date,
           pro_details : $rootScope.currentUser.product_detail
        }
        //
        $scope.showOption = function () {
            $scope.showdiscount = 1;
            if ($scope.disc.days != '2') {
                $scope.custom_dis = 1;
            }
        }
        
        $scope.changevendor = function(type){
            console.log(type)
            $rootScope.vendor_type = type;
            $scope.data = {};
        }

        $scope.additionalservices = function () {
            $scope.fields.push(Math.random());
        }
        $scope.add_addon = function (addon) {
            var title = $scope.data.more_title;
            var price = $scope.data.more_price;
            var newadds = {
                title: title,
                price: price
            }
            console.log(newadds)
            if (price != undefined) {
                if (title != undefined && title != ''){
                    if(addon == 'moreAddon'){ $scope.moreAddon.push(newadds);}
                     else if (addon == 'moreAddon1'){ $scope.moreAddon1.push(newadds);}
                    else if (addon == 'moreAddon2'){ $scope.moreAddon2.push(newadds);}
                    else if (addon == 'moreAddon3'){ $scope.moreAddon3.push(newadds);}
                    else if (addon == 'moreAddon4'){ $scope.moreAddon4.push(newadds); alert(JSON.stringify($scope.moreAddon4))}
                    else if (addon == 'moreAddon5'){ $scope.moreAddon5.push(newadds);}
                    else if (addon == 'moreAddon6'){ $scope.moreAddon6.push(newadds);}
                   
                    $scope.data = {};
                } else {
                      alert('Please enter a value')
                }
            } else {
                alert('Please enter a value')
            }
            console.log($scope.addon);
        }

        $scope.check = function (event, model) {
            console.log(event.target.checked, model)
            for (let i in $scope.moreAddon) {
                if ($scope.moreAddon[i].title == model) {
                    $scope.moreAddon.splice(i, 1);
                    console.log($scope.moreAddon);
                }
            }
            if ($scope.moreAddon1.length != 0) {
                for (let i in $scope.moreAddon1) {
                    if ($scope.moreAddon1[i].title == model) {
                        $scope.moreAddon1.splice(i, 1);
                        console.log($scope.moreAddon1);
                    }
                }
            }
            for (let i in $scope.moreAddon2) {
                if ($scope.moreAddon2[i].title == model) {
                    $scope.moreAddon2.splice(i, 1);
                    console.log($scope.moreAddon2);
                }
            }
            for (let i in $scope.moreAddon3) {
                if ($scope.moreAddon3[i].title == model) {
                    $scope.moreAddon3.splice(i, 1);
                    console.log($scope.moreAddon3);
                }
            }
            for (let i in $scope.moreAddon4) {
                if ($scope.moreAddon4[i].title == model) {
                    $scope.moreAddon4.splice(i, 1);
                    console.log($scope.moreAddon4);
                }
            }
            for (let i in $scope.moreAddon5) {
                if ($scope.moreAddon5[i].title == model) {
                    $scope.moreAddon5.splice(i, 1);
                    console.log($scope.moreAddon5);
                }
            }
            for (let i in $scope.moreAddon6) {
                if ($scope.moreAddon6[i].title == model) {
                    $scope.moreAddon6.splice(i, 1);
                    console.log($scope.moreAddon6);
                }
            }
            
            if (event.target.checked == false) {
                if (model == 'candid') {
                    this.groom.candid = '';
                } else if (model == 'video_editing') {
                    this.groom.video_editing = '';
                } else if (model == 'portrait') {
                    this.groom.portrait = '';
                } else if (model == 'photo_book') {
                    this.groom.photo_book = '';
                } else if (model == 'delivery_addon') {
                    $scope.groom.delivery_addon = '';
                } else if (model == 'inhouse_addon') {
                    $scope.groom.inhouse_addon = '';
                } else if (model == 'tailoring_addon') {
                    $scope.groom.tailoring_addon = '';
                } else if (model == 'designing_addon') {
                    $scope.groom.designing_addon = '';
                } else if (model == 'maching_addon') {
                    $scope.groom.maching_addon = '';
                } else if (model == 'air_addon') {
                    $scope.groom.air_addon = '';
                } else if (model == 'travel_addon') {
                    $scope.groom.travel_addon = '';
                } else if (model == 'delivery1_addon') {
                    $scope.groom.delivery1_addon = '';
                } else if (model == 'design_addon') {
                    $scope.groom.design_addon = '';
                } else if (model == 'demo_addon') {
                    $scope.groom.demo_addon = '';
                } else if (model == 'non_veg') {
                    $scope.groom.non_veg = '';
                } else if (model == 'healthy_addon') {
                    $scope.groom.healthy_addon = '';
                } else if (model == 'hallal_addon') {
                    $scope.groom.hallal_addon = '';
                } else if (model == 'onion_addon') {
                    $scope.groom.onion_addon = '';
                } else if (model == 'garlic_addon') {
                    $scope.groom.garlic_addon = '';
                } else if (model == 'sound_addon') {
                    $scope.groom.sound_addon = '';
                } else if (model == 'lighting_addon') {
                    $scope.groom.lighting_addon = '';
                } else if (model == 'security_addon') {
                    $scope.groom.security_addon = '';
                } else if (model == 'cocktail_addon') {
                    $scope.groom.cocktail_addon = '';
                }
            }
        };

        $scope.check_high = function (event, model) {
            console.log(event.target.checked, model)
            if (event.target.checked == false) { // bridal is used for highlights
                if (model == 'candid_high') {
                    this.bridal.candid_high = '';
                } else if (model == 'videoediting_high') {
                    this.bridal.videoediting_high = '';
                } else if (model == 'portrait_high') {
                    this.bridal.portrait_high = '';
                } else if (model == 'photobook_high') {
                    this.bridal.photobook_high = '';
                } else if (model == 'travel') {
                    $scope.bridal.travel1 = ''
                } else if (model == 'bulkdisc_travel') {
                    $scope.bridal.bulkdisc_travel = ''
                } else if (model == 'home_delivery') {
                    $scope.bridal.home_delivery = ''
                } else if (model == 'theme_high') {
                    $scope.bridal.theme_high = '';
                } else if (model == 'continental_high') {
                    $scope.bridal.continental_high = '';
                } else if (model == 'healthy_high') {
                    $scope.bridal.healthy_high = '';
                } else if (model == 'allergy_high') {
                    $scope.bridal.allergy_high = '';
                } else if (model == 'pool_high') {
                    $scope.bridal.pool_high = '';
                } else if (model == 'outdoor_high') {
                    $scope.bridal.outdoor_high = '';
                } else if (model == 'nearcity_high') {
                    $scope.bridal.nearcity_high = '';
                } else if (model == 'nearaiport_high') {
                    $scope.bridal.nearaiport_high = '';
                } else if (model == 'bar_high') {
                    $scope.bridal.bar_high = '';
                } else if (model == 'mandap_high') {
                    $scope.bridal.mandap_high = '';
                } else if (model == 'dj_high') {
                    $scope.bridal.dj_high = '';
                }
                for (let i in $scope.moreHigh) {
                    if ($scope.moreHigh[i].title == model) {
                        $scope.moreHigh.splice(i, 1);
                        console.log($scope.moreHigh);
                    }
                }
            }
        };
        $scope.showDiscountOption = function (value) {
          
            $scope.discount = value;
            if ($scope.discount == 'custom') {
                $scope.showdiscount = 1;
                console.log($scope.showdiscount)
             
                $scope.custom_dis = 1;
            } else {
                $scope.showdiscount = 1;
                $scope.custom_dis = 0;
            }
        };
        $scope.save_discount = function () {
            console.log($scope.disc)
            if ($scope.discount == 'custom') {
                $scope.user.discount = {
                    days: $scope.disc.days,
                    title: $scope.disc.title,
                    amount: $scope.disc.amount
                }
            } else {
                $scope.user.discount = {
                    days: $scope.discount,
                    title: $scope.disc.title,
                    amount: $scope.disc.amount
                }
            }
            console.log($scope.user.discount);
            $scope.showdiscount = 0;
            $scope.custom_dis = 0;
        }
         $scope.save_discount(); // call this function to set $scope.user.discount by default
        $scope.add_highlight = function () {
            $scope.vendordata = {};

            var title = $scope.data1.more_title;
            var price = JSON.parse($scope.data1.more_price);
            var newadds = {
                title: title,
                price: price
            }
            console.log(newadds)
            if (price != undefined) {
                if (title != undefined && title != '') {
                    $scope.moreHigh.push(newadds);
                    $scope.data1 = {};
                } else {
                    alert('Please enter a value')
                }
            } else {
                alert('Please enter a value')
            }
            console.log($scope.moreHigh);
        }

        $scope.vendor_process = function (user) {
            console.log($scope.moreAddon4)
            if ($scope.user.location != undefined) {
                $scope.vendordata = {};
                if ($scope.user.deals == undefined) {
                    $scope.user.deals = {};
                    $scope.user.deals.amount = '';
                    $scope.user.deals.effect_date = '';
                    $scope.user.deals.pro_details = '';
                }
                if (this.groom.candid == undefined) {
                    this.groom.candid = '';
                }
                if (this.groom.video_editing == undefined) {
                    this.groom.video_editing = '';
                }
                if (this.groom.portrait == undefined) {
                    this.groom.portrait = '';
                }
                if (this.groom.photo_book == undefined) {
                    this.groom.photo_book = '';
                }
                if (this.bridal.candid_high == undefined) {
                    this.bridal.candid_high = '';
                }
                if (this.bridal.videoediting_high == undefined) {
                    this.bridal.videoediting_high = '';
                }
                if (this.bridal.portrait_high == undefined) {
                    this.bridal.portrait_high = '';
                }
                if ($scope.user.discount == undefined) {
                    $scope.user.discount = '';
                }

                if ($scope.bridal.travel1 == undefined) {
                    $scope.bridal.travel1 = '';
                }
                if ($scope.bridal.design == undefined) {
                    $scope.bridal.design = '';
                }
                if ($scope.bridal.bulkdisc_travel == undefined) {
                    $scope.bridal.bulkdisc_travel = '';
                }
                if ($scope.bridal.home_delivery == undefined) {
                    $scope.bridal.home_delivery = '';
                }
                if ($scope.groom.delivery_addon == undefined) {
                    $scope.groom.delivery_addon = ''
                }
                if ($scope.groom.inhouse_addon == undefined) {
                    $scope.groom.inhouse_addon = ''
                }
                if ($scope.groom.tailoring_addon == undefined) {
                    $scope.groom.tailoring_addon = ''
                } if ($scope.groom.designing_addon == undefined) {
                    $scope.groom.designing_addon = ''
                } if ($scope.groom.maching_addon == undefined) {
                    $scope.groom.maching_addon = ''
                } if ($scope.bridal.theme_high == undefined) {
                    $scope.bridal.theme_high = '';
                } if ($scope.groom.air_addon == undefined) {
                    $scope.groom.air_addon = ''
                } if ($scope.groom.travel_addon == undefined) {
                    $scope.groom.travel_addon = ''
                } if ($scope.groom.delivery1_addon == undefined) {
                    $scope.groom.delivery1_addon = ''
                } if ($scope.groom.demo_addon == undefined) {
                    $scope.groom.demo_addon = ''
                } if ($scope.groom.design_addon == undefined) {
                    $scope.groom.design_addon = ''
                } if ($scope.groom.sound_addon == undefined) {
                    $scope.groom.sound_addon = '';
                } if ($scope.groom.lighting_addon == undefined) {
                    $scope.groom.lighting_addon = '';
                } if ($scope.groom.security_addon == undefined) {
                    $scope.groom.security_addon = '';
                } if ($scope.groom.cocktail_addon == undefined) {
                    $scope.groom.cocktail_addon = '';
                } if ($scope.groom.nonveg_addon == undefined) {
                    $scope.groom.nonveg_addon = ''
                } if ($scope.groom.healthy_addon == undefined) {
                    $scope.groom.healthy_addon = ''
                } if ($scope.groom.hallal_addon == undefined) {
                    $scope.groom.hallal_addon = ''
                } if ($scope.groom.onion_addon == undefined) {
                    $scope.groom.onion_addon = ''
                } if ($scope.groom.garlic_addon == undefined) {
                    $scope.groom.garlic_addon = ''
                } if ($scope.bridal.continental_high == undefined) {
                    $scope.bridal.continental_high = ''
                } if ($scope.bridal.allergy_high == undefined) {
                    $scope.bridal.allergy_high = ''
                } if ($scope.bridal.healthy_high == undefined) {
                    $scope.bridal.healthy_high = ''
                }
                if ($scope.bridal.pool_high == undefined) {
                    $scope.bridal.pool_high = ''
                } if ($scope.bridal.outdoor_high == undefined) {
                    $scope.bridal.outdoor_high = ''
                } if ($scope.bridal.nearcity_high == undefined) {
                    $scope.bridal.nearcity_high = ''
                } if ($scope.bridal.nearaiport_high == undefined) {
                    $scope.bridal.nearaiport_high = ''
                } if ($scope.bridal.bar_high == undefined) {
                    $scope.bridal.bar_high = ''
                } if ($scope.bridal.mandap_high == undefined) {
                    $scope.bridal.mandap_high = ''
                } if ($scope.bridal.dj_high == undefined) {
                    $scope.bridal.dj_high = ''
                }


                 for (let i in $scope.moreAddon) {
                    if ($scope.moreAddon[i].$$hashKey) {
                        delete $scope.moreAddon[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon1) {
                    if ($scope.moreAddon1[i].$$hashKey) {
                        delete $scope.moreAddon1[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon2) {
                    if ($scope.moreAddon2[i].$$hashKey) {
                        delete $scope.moreAddon2[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon3) {
                    if ($scope.moreAddon3[i].$$hashKey) {
                        delete $scope.moreAddon3[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon4) {
                    if ($scope.moreAddon4[i].$$hashKey) {
                        delete $scope.moreAddon4[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon5) {
                    if ($scope.moreAddon5[i].$$hashKey) {
                        delete $scope.moreAddon5[i].$$hashKey
                    }
                }
                for (let i in $scope.moreAddon6) {
                    if ($scope.moreAddon6[i].$$hashKey) {
                        delete $scope.moreAddon6[i].$$hashKey
                    }
                }
                for (let i in $scope.gallary) {
                    if ($scope.gallary[i].$$hashKey) {
                        delete $scope.gallary[i].$$hashKey
                    }
                }
                
                if ($rootScope.vendor_type == 'Photographer') {
                    $scope.user.additional_addons = $scope.moreAddon;
                    $scope.user_addon = {
                        candid: this.groom.candid,
                        video_editing: this.groom.video_editing,
                        portrait: this.groom.portrait,
                        photo_book: this.groom.photo_book,
                    }

                    $scope.user_highlight = {
                        candid_high: this.bridal.candid_high,
                        videoediting_high: this.bridal.videoediting_high,
                        portrait_high: this.bridal.portrait_high,
                        photobook_high: this.bridal.photobook_high,
                    }
                } else if ($rootScope.vendor_type == 'Make Up' || $rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {
                    $scope.user_highlight = {
                        travel: $scope.bridal.travel1,
                        bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                        home_delivery: $scope.bridal.home_delivery,
                        design_customization: $scope.bridal.design
                    }
                    console.log($scope.user_highlight);

                    if ($rootScope.vendor_type == 'Make Up') {
                        $scope.user_addon = {
                            air_brush: $scope.groom.air_addon,
                            travel: $scope.groom.travel_addon
                        }
                          $scope.user.additional_addons = $scope.moreAddon1;
                    } else if ($rootScope.vendor_type == 'Bridal Wear' || $rootScope.vendor_type == 'Groomwear') {
                          $scope.user.additional_addons = $scope.moreAddon4;
                        $scope.user_addon = {
                            delivery: $scope.groom.delivery_addon,
                            inhouse: $scope.groom.inhouse_addon,
                            tailoring: $scope.groom.tailoring_addon,
                            designing: $scope.groom.designing_addon,
                            maching: $scope.groom.maching_addon
                        };
                        console.log($scope.user.additional_addons)
                    }
                } else if ($rootScope.vendor_type == 'Sangeet Choreographer' || $rootScope.vendor_type == 'Mehandi Artist' || $rootScope.vendor_type == 'Wedding Cake' || $rootScope.vendor_type == 'Wedding Entertainment' || $rootScope.vendor_type == 'Wedding Cards' || $rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {

                    if ($rootScope.vendor_type == 'Wedding Planner' || $rootScope.vendor_type == 'Wedding Decorator') {
                        $scope.user_highlight = {
                            theme_high: $scope.bridal.theme_high,
                        }
                    } else {
                        $scope.user_highlight = {
                            travel: $scope.bridal.travel1,
                            bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                            home_delivery: $scope.bridal.home_delivery,
                            design_customization: $scope.bridal.design
                        }
                    }
                    $scope.user_addon = '';
                      $scope.user.additional_addons = $scope.moreAddon2;
                } else if ($rootScope.vendor_type == 'Wedding Jewellery' || $rootScope.vendor_type == 'Wedding Accessories') {
                    $scope.user_addon = {
                        delivery: $scope.groom.delivery_addon,
                        inhouse: $scope.groom.inhouse_addon,
                        custom_dis: $scope.groom.tailoring_addon,
                    };
                    $scope.user_highlight = {
                        travel: $scope.bridal.travel1,
                        bulkdisc_travel: $scope.bridal.bulkdisc_travel,
                        home_delivery: $scope.bridal.home_delivery,
                        design_customization: $scope.bridal.design
                    }
                      $scope.user.additional_addons = $scope.moreAddon3;
                } else if ($rootScope.vendor_type == 'Wedding Catering') {
                    $scope.user_addon = {
                        non_veg: $scope.groom.nonveg_addon,
                        healthy: $scope.groom.healthy_addon,
                        hallal: $scope.groom.hallal_addon,
                        wo_onion: $scope.groom.onion_addon,
                        wo_garlic: $scope.groom.garlic_addon,
                    };
                    $scope.user_highlight = {
                        continental: $scope.bridal.continental_high,
                        allergy: $scope.bridal.allergy_high,
                        healthy: $scope.bridal.healthy_high
                    }
                      $scope.user.additional_addons = $scope.moreAddon5;
                } else if ($rootScope.vendor_type == 'Wedding Venue') {
                      $scope.user.additional_addons = $scope.moreAddon6;
                    $scope.user_addon = {
                        sound: $scope.groom.sound_addon,
                        lighting: $scope.groom.lighting_addon,
                        security: $scope.groom.security_addon,
                        cocktail: $scope.groom.cocktail_addon,
                    };
                    $scope.user_highlight = {
                        outdoor: $scope.bridal.outdoor_high,
                        nearcity: $scope.bridal.nearcity_high,
                        nearairpot: $scope.bridal.nearaiport_high,
                        bar: $scope.bridal.bar_high,
                        mandap: $scope.bridal.mandap_high,
                        dj: $scope.bridal.dj_high,
                        pool: $scope.bridal.pool_high,
                    }
                }

                console.log($scope.user.additional_addons);

                $scope.user.addon = $scope.user_addon;
                for(let i in $scope.moreHigh){
                    if($scope.moreHigh[i].$$hashKey){
                            delete $scope.moreHigh[i].$$hashKey
                    } 
                }

                $scope.user.additional_highlight = $scope.moreHigh;
                $scope.user.highlight = $scope.user_highlight;

                if ($scope.user.additionalservice == undefined) {
                    $scope.user.additionalservice = '';
                }
                var postdata = {
                    id: $rootScope.user_id,
                    establishment_year: $scope.user.establishment_year,
                    sworking_hours: $scope.user.start_hours,
                    eworking_hours: $scope.user.end_hours,
                    facebook_username: $scope.user.facebook_username,
                    twitter_username: $scope.user.twitter_username,
                    instagram_username: $scope.user.instagram_username,
                    location: $scope.user.location,
                    email: $scope.user.email,
                    discount_amount: $scope.user.deals.amount,
                    effective_date: $scope.user.deals.effect_date,
                    product_detail: $scope.user.deals.pro_details,
                    awards: $scope.user.awards,
                    vendor_type : $rootScope.vendor_type,
                    phone : $rootScope.phone,
                    company_name : $rootScope.company_name,
                    about_us : $scope.user.about_us,
                    // maximum_guest: data.value.maxguest,
                    //  minimum_guest: data.value.minguest,
                    additional_addon: JSON.stringify($scope.user.additional_addons),
                    addon: JSON.stringify($scope.user.addon),
                    highlights: JSON.stringify($scope.user.highlight),
                    discount:JSON.stringify( $scope.user.discount),
                    gallery: JSON.stringify($scope.gallary),
                    additional_highlights: JSON.stringify($scope.user.additional_highlight),
                    //  photo_vedio: JSON.stringify(this.photovedio),
                    additional_discounts : 'undefined',
                    // additional_photo_vedio: JSON.stringify(this.items1),
                    //  additional_discounts: JSON.stringify(this.morediscount),
                    //  price_per_plate: JSON.stringify(this.price_per_plate),
                    additionalservices: JSON.stringify($scope.user.additionalservice),
                    services: JSON.stringify($scope.user.service)
                }

                // user.addon = JSON.parse(req.body.addon);
                // user.highlights = JSON.parse(req.body.highlights);
                // user.discount = JSON.parse(req.body.discount);
                // user.gallery_image = JSON.parse(req.body.gallery);
                // if (req.body.additional_addon.length > 0) {
                //     user.additional_addon = JSON.parse(req.body.additional_addon);
                // }
                // if (req.body.additional_highlights.length > 0) {
                //     user.additional_highlights = JSON.parse(req.body.additional_highlights);
                // }
                // if (req.body.additional_discounts != 'undefined') {
                //     user.additional_discounts = JSON.parse(req.body.additional_discounts);

                console.log(postdata)
                // return false;
                Users.saveinfo(postdata).then(function (res) {
                    console.log(res);
                    if (res.status == true) {
                        $scope.success_msg = res.message;
                        alert(res.message)
                       sessionStorage.setItem('user', JSON.stringify(res.data))
                    } else {
                        $scope.error_msg = res;
                    }
                });
            }
        }
    })