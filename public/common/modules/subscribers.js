var postsModule = angular.module('ghangout.subscribers', []);

postsModule.service('Subscribers', function($http){

	return {
		all: function(){
			return $http.get('/api/subscriber').then(function(postList){
				return postList.data;
			});
		},
		add: function(newPost){
			return $http({
				method: 'post',
				url: '/api/subscriber',
				data: newPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
                           // console.error('Something went wrong adding the post!');
				console.log('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
		},
//                singledata: function(id) {
//                    return $http({
//                        method: 'get',
//                        url: '/api/faqs/'+id.path,
//                       // data: id
//                    }).then(function(res) {
//                        // return the new post
//                        return res.data;
//                    }).catch(function(err) {
//                        console.error('Something went wrong adding the post!');
//                        console.error(err);
//                        return err;
//                    });
//                },
		remove: function(data){
                    return $http({
                        method: 'delete',
                        url: '/api/faqs/delete/'+data.id,
                        data: data
                    }).then(function(res) {
                        // return the new post
                        return res.data;
                    }).catch(function(err) {
                        console.error('Something went wrong adding the post!');
                        console.error(err);
                        return err;
                    });
		},
//		update: function(data){
//                    return $http({
//                        method: 'put',
//                        url: '/api/faqs/update/'+data.id,
//                        data: data
//                    }).then(function(res) {
//                        // return the new post
//                        return res.data;
//                    }).catch(function(err) {
//                        console.error('Something went wrong adding the post!');
//                        console.error(err);
//                        return err;
//                    });
//		},
                findSubscribtionStatus: function(newPost){
			return $http({
				method: 'post',
				url: '/api/subscribe/findSubscribtionStatus',
				data: newPost
			}).then(function(res){
				// return the new post
				return res.data;
			}).catch(function(err){
                            console.error('Something went wrong adding the post!');
				//console.log('Something went wrong adding the post!');
				console.error(err);
				return err;
			});
		}
	};
});