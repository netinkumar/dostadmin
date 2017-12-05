var app = angular.module('mean-blog.home', [
    'ui.router',
    'ngMaterial',
    'ghangout.users',
    'ghangout.contacts',
    'ghangout.groups',
    'ghangout.vendortypes',
    'ghangout.vendor_subtypes'
    //    'ghangout.faqs',
    //   'ghangout.subscribes'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "/home/templates/onlinegroups.html",
            controller: 'OnlineGroupsCtrl',
            //                        resolve: {
            //                            groupsList: function(Groups){
            //                                    return Groups.all().then(function(data){
            //                                        console.log('1')
            //                                        console.log(data)
            //                                            return data;
            //                                    });
            //                            }
            //			}
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "/home/templates/contact.html",
            controller: 'ContactCtrl'
        })
        .state('faq', {
            url: "/faq",
            templateUrl: "/home/templates/faq.html",
            controller: 'FaqsCtrl',
            //                        resolve: {
            //                            FaqsList: function(Faqs){
            //                                    return Faqs.all().then(function(data){
            //                                        console.log('1')
            //                                        console.log(data)
            //                                            return data;
            //                                    });
            //                            }
            //			}
        })
        .state('organizers', {
            url: '/organizers',
            templateUrl: '/home/templates/organizers.html',
            controller: 'OrganizerCtrl'
        })
        .state('vieworganizer', {
            url: '/vieworganizer/:organizerid',
            templateUrl: '/home/templates/viewprofile.html',
            controller: 'viewProfileCtrl'
        })
        .state('creategroup', {
            url: '/creategroup',
            templateUrl: '/home/templates/creategroup.html',
            controller: 'creategroupCtrl'
        })
        .state('editprofile', {
            url: '/editprofile/:user_id',
            templateUrl: '/home/templates/editprofile.html',
            controller: 'editprofileCtrl'
        })
        .state('changePassword', {
            url: '/changepassword/:user_id',
            templateUrl: '/home/templates/changepassword.html',
            controller: 'changepasswordCtrl'
        })
        .state('resetpassword', {
            url: '/resetpassword',
            templateUrl: '/home/templates/forgotpassword.html',
            controller: 'ForgetCtrl'
        })
        .state('invitationcode', {
            url: '/invitationcode',
            templateUrl: '/home/templates/code.html',
            controller: 'invitationCtrl'
        })
        .state('vendor_process', {
            url: '/vendor_process',
            templateUrl: '/home/templates/signup_vendorprocess.html',
            controller: 'VendorProcessCtrl'
        })
        .state('verifycode', {
            url: '/verifycode',
            templateUrl: '/home/templates/verifycode.html',
            controller: 'VerifyCtrl'
        })
        .state('vendor_view', {
            url: '/vendor_view',
            templateUrl: '/home/templates/vendor_view.html',
            controller: 'vendorviewCtrl'
        })
        .state('vendor_detail', {
            url: '/vendor_detail',
            templateUrl: '/home/templates/vendor_detail.html',
            controller: 'vendordetailCtrl'
        })
        .state('list', {
            url: '/list',
            templateUrl: '/home/templates/list.html',
            controller: 'vendorlistCtrl'
        })
        .state('postjob', {
            url: '/postjob',
            templateUrl: '/home/templates/postjob.html',
            controller: 'postjobCtrl'
        })
        .state('signup_vendor', {
            url: '/signup_vendor',
            templateUrl: '/home/templates/signup_vendor.html',
            controller: 'VendorSignupCtrl'
        })
        .state('editbasicinfo', {
            url: '/editbasicinfo',
            templateUrl: '/home/templates/editprofile.html',
            controller: 'editbasicinfoCtrl'
        })
        .state('aboutus', {
            url: '/aboutus',
            templateUrl: '/home/templates/aboutus.html',
            controller: 'aboutusCtrl'
        })
        .state('changepassword', {
            url: '/changepassword',
            templateUrl: '/home/templates/changepassword.html',
            controller: 'changepasswordCtrl'
        })

    $urlRouterProvider.otherwise("/");
});