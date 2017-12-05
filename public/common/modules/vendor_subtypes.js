var vendor_subtypesModule = angular.module('ghangout.vendor_subtypes', []);

contactsModule.service('Vendor_subtypes', function($http) {

    return {
        all: function() {
            return $http.get('/api/vendor_subtypes').then(function(userList) {
                return userList.data;
            });
        },
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/vendor_subtypes',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        subByvendors: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/vendor_subtypes_byvendor',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the user!');
                console.error(err);
                return err;
            });
        },
        remove: function(usr) {
            //console.log("here")
            return $http({
                method: 'post',
                url: '/api/vendor_subtypes/delete',
                data: usr
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });

        },
        update: function(usr) {

            return $http({
                method: 'post',
                url: '/api/editusrID',
                data: usr
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });

        },
        sigledata: function(id) {
            return $http({
                method: 'post',
                url: '/api/edituser',
                data: id
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        
    };
});