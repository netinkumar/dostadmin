var FAQ = require('../models/faq');

// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/faqs', function(req, res){
		FAQ.find({}, function(err, posts){
			if (err) {res.send(err);}else{
                            res.json(posts);
                        }

			
		});
	});

	// add a post
	apiRouter.post('/faqs', function(req, res){
		
		var post = new FAQ();
		post.title = req.body.title;
		post.body = req.body.body;
               
                post.save(function(err, post){
                    if(err){ res.send(err);}else{
                        res.json({status:true,message:'Saved successfully!'});
                        // res.json(post);
                    }
                })
                     
		
	});

	// get a single post
	apiRouter.get('/faqs/:id', function(req, res){
		FAQ.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/faqs/update/:id', function(req, res){
		FAQ.findById(req.params.id, function(err, post){
			if(err) res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'FAQ updated successfully!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/faqs/delete/:id', function(req, res){
		FAQ.remove({
			_id: req.params.id
		}, function(err, post){
			if(err){ res.send(err);}else{
                            res.json({ message: 'FAQ deleted successfully!' });
                        }
		})
	});
};