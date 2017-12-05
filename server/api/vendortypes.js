var Vendortype = require('../models/vendortype');

// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/vendortypes', function(req, res){
		Vendortype.find({}, function(err, posts){
			if (err) res.json({status : false, error : err});

			res.json({status : true, data : posts});
		});
	});

	// add a post
	apiRouter.post('/vendortypes', function(req, res){
		console.log(req.body)
		var post = new Vendortype();
		post.title = req.body.title;
                post.others = req.body.others;
                Vendortype.find({'title':post.title},function(error,post_value){
                    if(error){
                        return res.send(error)
                    }else{
                        if(post_value.length >0){
                            res.json({status:false,message:'Title already used! Please try another one!'});
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
	apiRouter.get('/vendortypes/:id', function(req, res){
		Vendortype.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/vendortypes/:id', function(req, res){
		Vendortype.findById(req.params.id, function(err, post){
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
	apiRouter.delete('/vendortypes/:id', function(req, res){
		Vendortype.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
};