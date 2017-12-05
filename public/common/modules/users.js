var usersModule = angular.module('ghangout.users', []);

usersModule.service('Users', function($http) {

    return {
        all: function() {
            return $http.get('/api/users').then(function(userList) {
                return userList.data;
            });
        },
        add: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users',
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
        homeadd: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/home',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        forgetpass: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/forgetpass',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        resetpwd: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/resetpassword',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
           chnagepass: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/changepass',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        login: function(newUser) {
            return $http({
                method: 'post',
                url: '/api/users/login',
                data: newUser
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        remove: function(usr) {
            //console.log("here")
            return $http({
                method: 'post',
                url: '/api/deleteuser',
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
         homeupdate: function(usr) {

            return $http({
                method: 'post',
                url: '/api/editusrhome',
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
        sendcode: function(usr) {
            return $http({
                method: 'post',
                url: '/api/users/addpending',
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
        verifycode: function(usr) {
            return $http({
                method: 'post',
                url: '/api/users/checkcode',
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
        saveinfo: function(usr) {
            return $http({
                method: 'post',
                url: '/api/users/savebasicinfo_new',
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
                url: '/api/users/userdetails',
                data: id
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        }, sigleuser: function(id) {
            return $http({
                method: 'post',
                url: '/api/users/singleuser',
                data: id
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        }, getvendorbytype: function(type) {
            return $http({
                method: 'post',
                url: '/api/users/getvendorbytype',
                data: type
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong. Please try again!');
                console.error(err);
                return err;
            });
        }, getallvendors: function(type) {
            return $http({
                method: 'post',
                url: '/api/users/getallvendors',
                data: type
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong. Please try again!');
                console.error(err);
                return err;
            });
        },
          uploadimage: function(image) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", image);
            return $http({
                method: 'post',
                url: '/api/users/uploaduserimage',
                data: fd,
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        uploadgallary :  function(image) {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", image);
            return $http({
                method: 'post',
                url: '/api/users/gallaryimage',
                data: fd,
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function(res) {
                // return the new post
                return res.data;
            }).catch(function(err) {
                console.error('Something went wrong adding the post!');
                console.error(err);
                return err;
            });
        },
        organizers: function(loggedin_user_id) {
            if(loggedin_user_id){
                return $http.get('/api/users/organizers/'+loggedin_user_id).then(function(userList) {
                return userList.data;
            });
            }else{
                return $http.get('/api/users/organizers').then(function(userList) {
                return userList.data;
            });
            }
            return $http.get('/api/users/organizers'+loggedin_user_id).then(function(userList) {
                return userList.data;
            });
        },
    };
});