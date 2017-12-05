var Vendor_subtype = require('../models/vendor_subtype');

// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/vendor_subtypes', function(req, res){
		Vendor_subtype.find({}, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

	// add a post
	apiRouter.post('/vendor_subtypes', function(req, res){
		console.log(req.body)
		var post = new Vendor_subtype();
                post.title = req.body.title;
                post.vendortype = req.body.vendortype;
                post.vendortype_id = req.body.vendortype_id;
                post.multiple = req.body.multiple;
               
                console.log(post)
                Vendor_subtype.find({'title':post.title},function(error,post_value){
                    if(error){
                        return res.send({status: false, error: error})
                    }else{
                        if(post_value.length >0){
                            res.json({status:false,message:'Title already used! Please try another one!'});
                        }else{
                            post.save(function(err, post){
                                if(err){ 
                                   res.json({status: false, error: err});
                                }else{
                                    res.json({status:true,message:'Saved successfully!'});
                                    // res.json(post);
                                }
                        })
                        }
                        
                    }
                })
		
	});

	// get a all subvendor of a vendor
	apiRouter.post('/vendor_subtypes_byvendor', function(req, res){
                var id = req.body.id
		Vendor_subtype.find({vendortype_id : id}, function(err, post){
			if (err) res.json({status: false, error : err});

			res.json({status: true, data : post});
		});
	});

	
};