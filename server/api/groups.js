var Group = require('../models/group');
var User = require('../models/user');

// Posts API
module.exports = function(apiRouter,transporter){
	
	// get all posts
	apiRouter.get('/groups', function(req, res){
		Group.find({}, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

	// add a post
	apiRouter.post('/groups', function(req, res){
		
		var post = new Group();
		post.name = req.body.name;
		post.email = req.body.email;
                post.conference_time = req.body.conference_time;
                post.date = req.body.date;
                
                post.save(function(err, post){
                    if(err){ res.send(err);}else{
//                        res.json({'status':true,'data':post});
                        
                        User.findById(req.body.user_id, function(err1, post1){
			if (err1) {res.send(err1);}else{
                            console.log(post1)
                            if(post1.role=='user'){
                                var newData ={}
                                newData.role = 'organizer'
                                User.update({ _id:post1._id} , { $set: newData },function(err_up,post_up){
                                    if (err_up) {res.send(err_up);}else{
                                        console.log(post_up)
                                        res.json({'status':true,'message':'Group created Successfully'});
                                    }
                                } )
                            }else{
                                // send mail to friends
//                                 var array = post.email.split(",");
//                                console.log(array)
//                                var i=0;
//                                console.log(array.length)
//                                for(i;i<array.length;i++){
//                                console.log(array[i])
//                                }
                                //host = req.get('host');//remember the server (i.e host) address
                                //link = "http://" + req.get('host') + "/verify?id=" + usr._id;//create a url of the host server
                                var mailOptions = {
                                    from: 'ashutosh@avainfotech.com',
                                    to: post.email,
                                    subject: 'Welcome To MEAN',
                                    html: "Hello " + post.email + ",<br> "+post1.firstname+" has invited you to join a group with name: "+post.name+"<br>"
                                };
                                transporter.sendMail(mailOptions, function(error, info) {

                                    if (error) {
                                        res.send(error);
                                    } else {
                                        res.send("Done!");
                                    }
                                });
                
                            }
                        }

			
		});
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
};