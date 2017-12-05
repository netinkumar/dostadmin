var Contact = require('../models/contact');

// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/contacts', function(req, res){
		Contact.find({}, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

	// add a post
	apiRouter.post('/contacts', function(req, res){
		
		var post = new Contact();
		post.name = req.body.name;
		post.email = req.body.email;
                post.subject = req.body.subject;
                post.message = req.body.message;

		post.save(function(err, post){
			if(err) res.send(err);

			res.json({'status':true,'data':post});
		})
	});

	// get a single post
	apiRouter.get('/contacts/:id', function(req, res){
		Contact.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/contacts/:id', function(req, res){
		Contact.findById(req.params.id, function(err, post){
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
        apiRouter.post('/contacts/delete', function(req, res) {
            Contact.remove({
                _id: req.body.id
            }, function(err, user) {
                if (err)
                    res.send(err);
                res.json({message: 'Contact deleted!'});
            })
     });
	
};