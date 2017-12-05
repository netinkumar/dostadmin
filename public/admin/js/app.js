
var adminApp = angular.module('mean-blog.admin', [
	'ui.router',
	'btford.markdown',
	'mean-blog.posts',
        'ghangout.users',
        'ghangout.contacts',
        'ghangout.groups',
        'ghangout.vendortypes',
        'ghangout.vendor_subtypes'
]);

adminApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');
	
	$stateProvider
        .state('dashboard', {
		url: '/',
		templateUrl: '/admin/templates/admin_index.html',
		controller: 'dashboardCtrl'
	}) 
        
        //ForgotPasswordCtrl
        .state('ForgotPassword', {
                url: '/admin/forgot',
               // templateUrl: '/admin/templates/addPost.html',
                controller: 'ForgotPasswordCtrl'
        })
        .state('allPosts', {
                url: '/allPosts',
                templateUrl: '/admin/templates/allPosts.html',
                resolve: {
                        postList: function(Posts){
                                return Posts.all().then(function(data){
                                        return data;
                                });
                        }
                },
                controller: 'AllPostsCtrl'
        })
        .state('addPost', {
                url: '/addPost',
                templateUrl: '/admin/templates/addPost.html',
                controller: 'AddPostCtrl'
        })
        .state('addBlog', {
                url: '/addBlog',
                templateUrl: '/admin/templates/addBlog.html',
                controller: 'AddPostCtrl'
        })
        .state('userList', {
                url: '/userList',
                templateUrl: '/admin/templates/userList.html',
                resolve: {
                    userList: function(Users){
                            return Users.all().then(function(data){
                                    return data;
                            });
                    }
                },
                controller: 'AllUsersCtrl'
        })
                .state('addUser', {
			url: '/addUser',
			templateUrl: '/admin/templates/addUser.html',
			controller: 'addUserCtrl'   
		})
                .state('editUser', {
			url: '/editUser/:paraml',
			templateUrl: '/admin/templates/editUser.html',
			controller: 'editUserCtrl'
		})
                
                .state('addVendorType', {
			url: '/addVendorType',
			templateUrl: '/admin/templates/addVendorType.html',
			controller: 'AddVendorTypeCtrl'   
		})
                .state('addVendorTypeSub', {
			url: '/addVendorTypeSub',
			templateUrl: '/admin/templates/addVendorTypeSub.html',
                        resolve: {
                            vendortypeList: function(Vendortypes){
                                    return Vendortypes.all().then(function(data){
                                            return data;
                                    });
                            }
			},
			controller: 'addVendorTypeSubCtrl',
		})
                .state('allVendorTypes', {
			url: '/allVendorTypes',
			templateUrl: '/admin/templates/allVendorTypes.html',
			resolve: {
                            vendorList: function(Vendortypes){
                                    return Vendortypes.all().then(function(data){
                                            return data;
                                    });
                            }
			},
			controller: 'AllVendorTypesCtrl'
		})
                
});

