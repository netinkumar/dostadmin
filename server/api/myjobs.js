var Myjob = require('../models/myjob');
//var Subscribe = require('../models/subscribe');
// Users API
module.exports = function(apiRouter) {

apiRouter.post('/myjobs/myjob', function(req, res) {
    if(!req.body.userid){
         res.json({ 'status': false, 'message': 'Please login' });
    }else{
        Myjob.findOne({'userid':req.body.userid,'postid':req.body.postid },function(err,ll){
        if(ll){
        res.send({'status' :false, 'message' : "Alreday Accepted" });
       }else{
            console.log(req.body);
         var post = new Myjob();
         post.userid=req.body.userid;
         post.postid=req.body.postid;
         post.status='1'; // for Accept
         post.save(function(err,post) {
         if (err){
             res.send({'status' :false, 'data' : err });
            }else{
              res.send({'status' :true, 'message' : "Accept", 'data' : post});
         }
         });
            }
        }); 
    }

    });
    apiRouter.post('/myjobs/addbid', function(req, res) {
            if(!req.body.userid){
             res.json({ 'status': false, 'message': 'User not found' });
            }else{
                Myjob.findOne({'userid':req.body.userid,'postid':req.body.postid },function(err,ll){
                if(ll){
                ll.title = req.body.title;
                ll.cost = req.body.cost;
                ll.time = req.body.time;
                ll.location = req.body.location;
                ll.special_needs = req.body.special_needs;
                ll.slug = req.body.slug;
                ll.save(function(err1) {
                    if (err1){
                        res.json({'status':false,'message': res.send(err1)});
                        //res.send(err);
                    }else{
                      res.send({'status' :true, 'message' : "Bid Updated", data:ll });
                    }
                });
                
               }else{
                    console.log(req.body);
                var post = new Myjob();
                post.userid=req.body.userid;
                post.postid=req.body.postid;
                post.status='2'; // for bid
                post.title = req.body.title;
                post.cost = req.body.cost;
                post.time = req.body.time;
                post.location = req.body.location;
                post.special_needs = req.body.special_needs;
                post.slug = req.body.slug;
                post.save(function(err,post) {
                if (err){
                    res.send({'status' :false, 'data' : err });
                   }else{
                     res.send({'status' :true, 'message' : "Bid Submitted", 'data' : post});
                }
                });
            }
        }); 
    }
    });  
    
    apiRouter.post('/myjobs/singljobbid', function(req, res) {
		Myjob.findOne({'userid':req.body.userid,'postid':req.body.postid },function(err,post){
               	if (err){
                        res.send({'status' :false, 'data' : err });
                        }else{
                        res.send({'status' :true, 'data' : post });
                        }
		});
	});
};