var Vendortype = require('../models/vendortype');
var Vendor_subtype = require('../models/vendor_subtype');
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
                post.multiple = req.body.multiple;
                post.services = req.body.services;
                post.addons = req.body.addons;
                post.more_addons = req.body.more_addons;
                post.highlights = req.body.highlights;
                post.more_highlights = req.body.more_highlights;
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

	// delete a type
	apiRouter.post('/vendortypes/delete', function(req, res){
		Vendortype.remove({
			_id: req.body.id
		}, function(err, post){
			if(err) {
                           res.send({status: true, message:'Vendor type could not be deleted.',error: err}); 
                        } else {
                            Vendor_subtype.remove({vendortype_id : req.body.id}, function(err, post){
                              if(err) {
                                res.send({status: true, message:'Vendor type was delete but its subvendors could not be deleted.',error: err}); 
                              } else {
                                res.json({status: true, message: 'Vendor type deleted successfully!' });
                              }
                            })  
                        }
			
		})
	});
};