var Post = require('../models/post');
var Like = require('../models/like');
var ObjectId = require('mongodb').ObjectID;
var url = require('url');
var http = require('http');
// Posts API
module.exports = function(apiRouter,postsUpload){
	
	// get all posts
	apiRouter.get('/posts', function(req, res){
		Post.find({}, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

       	apiRouter.post('/allposts', function(req, res){
            console.log(req.body);
          Post.aggregate(
              { 
                "$lookup": { 
                    "localField": '_id', 
                    "from": 'likes', 
                    "foreignField": 'postid',
                    "as": 'user_info' 
                } 
            }
              , function(err, user_info) {
                if (err){ 
                  res.json({'status' : false, 'error' : err});
                }else{
                   console.log("aaaaa");
                   console.log(req.body.userid);
                   console.log("BBbbb..");
                   //return false;
                if(user_info.length>0){
                   console.log(user_info);
                   console.log("======");
                    for (let item of user_info) {
  
                        console.log(item.user_info[0]);
                        if(item.user_info.length > 0)
                        {
                        for (let items of item.user_info) {
                    if((items.userid) == (req.body.userid)){
                       item.is_liked = items.status;
                    }else{
                       item.is_liked = items.status;
                    }
                        }
                        }
                        else
                        {
                            item.is_liked = 0;
                        }
                   
                }   
                }else{
                     user_info.is_liked=0;
                }
                console.log(user_info);
                  res.json({'status' : true, 'data' : user_info});
            }
            });
        });


	// add a post
	apiRouter.post('/posts', function(req, res){
		var post = new Post();
		post.title = req.body.title;
                post.cost = req.body.cost;
                post.time = req.body.time;
                post.location = req.body.location;
                post.special_needs = req.body.special_needs;
                post.description = req.body.description;
		post.post_type = req.body.post_type;
                post.slug = req.body.slug;
                post.posted_by = req.body.posted_by;
                Post.find({'slug':post.slug},function(error,post_value){
                    if(error){
                        return res.send(error)
                    }else{
                        if(post_value.length >0){
                            res.json({status:false,message:'Slug already used! Please try another one!'});
                        }else{
                            post.save(function(err, post){
                                if(err){ res.send(err);}else{
                                    res.json({status:true,message:'Saved successfully!'});
                                    // res.json(post);
                                }
                        })
                        }
                        
                    }
                })
	});
        // add a blog
	apiRouter.post('/posts/addBlog', function(req, res){
		var post = new Post();
		post.title = req.body.title;
                post.location = req.body.location;
                post.description = req.body.description;
		post.post_type = req.body.post_type;
                post.slug = req.body.slug;
                post.posted_by = req.body.posted_by;
                post.image = req.body.image;
                Post.find({'slug':post.slug},function(error,post_value){
                    if(error){
                        return res.send(error)
                    }else{
                        if(post_value.length >0){
                            res.json({status:false,message:'Slug already used! Please try another one!'});
                        }else{
                            post.save(function(err, post){
                                if(err){ res.send(err);}else{
                                    res.json({status:true,message:'Saved successfully!'});
                                    // res.json(post);
                                }
                        })
                        }
                        
                    }
                })
	});

	// get a single post
	apiRouter.get('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err) res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Post updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/posts/:id', function(req, res){
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
        
        // upload image to bucket
        apiRouter.post('/posts/uploaduserimage',postsUpload.array('file',3), function(req, res, next) {
        // console.log(req.body);
         console.log(req.files);
         res.send(req.files);
     });
     
};