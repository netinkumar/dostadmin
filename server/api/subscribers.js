var Subscriber = require('../models/subscriber');
// Posts API
module.exports = function(apiRouter){
	
	// get all posts
	apiRouter.get('/subscriber', function(req, res){
		Subscriber.find({}, function(err, posts){
			if (err) {res.send(err);}else{
                            res.json(posts);
                        }

			
		});
	});

	// add a post
	apiRouter.post('/subscriber', function(req, res){
		
		var post = new Subscriber();
		post.email = req.body.email;
               console.log(req.body)
                post.save(function(err, post){
                    if(err){ res.send(err);}else{
                        res.json({status:true,message:'Subscribed successfully!'});
                        // res.json(post);
                    }
                })
	});

	// get a single post
	apiRouter.get('/subscriber/:id', function(req, res){
		Subscriber.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/subscriber/update/:id', function(req, res){
		Subscriber.findById(req.params.id, function(err, post){
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
	apiRouter.delete('/subscriber/delete/:id', function(req, res){
            console.log(req.params)
            console.log('simer')
		Subscriber.remove({
			_id: req.params.id
		}, function(err, post){
			if(err){ res.send(err);}else{
                            res.json({ message: 'FAQ deleted successfully!' });
                        }
		})
	});
        //findSubscribtionStatus 
        // test
        apiRouter.post('/subscribe/findSubscribtionStatus',function(req,res){
            
            User.aggregate([
                { $match: {'role':'organizer' } },
                { $lookup:
                      {
                        from: 'subscribes',
                        localField: '_id',
                        foreignField: 'organizer_id',
                        as: 'user_subscribes'
                      }
                }
            ]).exec(function ( err, data ) {
                if(err){
                    
                }else{
                    res.json(data)
                }
                
            });
           
           /*Subscribe.aggregate([
              //  { $match: { 'organizer_id' : req.body.organizer_id,'user_id':req.body.loggedin_user_id } },
                { $match: {'user_id':req.body.loggedin_user_id } },
                { $lookup:
                      {
                        from: 'users',
                        localField: 'organizer_id',
                        foreignField: '_id',
                        as: 'user_subscribes'
                      }
                }
            ]).exec(function ( e, d ) {
                console.log( d )  
                res.json(d)
            });*/
           
           /*User.aggregate([{
                    $lookup:
                      {
                        from: 'subscribes',
                        localField: '_id',
                        foreignField: 'organizer_id',
                        as: 'user_subscribes'
                      }
                 },function(err,data){
                     if(err){
                    res.send(err)
                }else{
                    res.json(data)
                }
                 }])*/
           /* Subscribe.findOne({'user_id':req.body.loggedin_user_id,'organizer_id':req.body.organizer_id},function(err,response){
                if(err){
                    res.send(err)
                }else{
                    //console.log(response)
                    if(response != null){
                        res.json({'status':true,'data':response});
                    }else{
                        res.json({'status':false,'message':'No data found'});
                    }
                    //res.json({'status':true,'data':res});
                }
            })*/
        })
        // working fine
        /*apiRouter.post('/subscribe/findSubscribtionStatus',function(req,res){
            //console.log(req.body)
           // console.log('1')
            Subscribe.findOne({'user_id':req.body.loggedin_user_id,'organizer_id':req.body.organizer_id},function(err,response){
                if(err){
                    res.send(err)
                }else{
                    //console.log(response)
                    if(response != null){
                        res.json({'status':true,'data':response});
                    }else{
                        res.json({'status':false,'message':'No data found'});
                    }
                    //res.json({'status':true,'data':res});
                }
            })
        })*/
};