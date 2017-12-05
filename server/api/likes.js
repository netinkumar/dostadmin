var Like = require('../models/like');
//var Subscribe = require('../models/subscribe');
// Users API
module.exports = function(apiRouter) {

apiRouter.post('/likes/like_post', function(req, res) {
    if(!req.body.userid){
         res.json({ 'status': false, 'message': 'Please login' });
    }else{
        Like.findOne({'userid':req.body.userid,'postid':req.body.postid },function(err,ll){
        if(ll){
            if(ll.status=='1'){
            ll.userid=req.body.userid;
            ll.postid=req.body.postid;
            ll.status='0'; // for unlike
            ll.save(function(err,post) {
            if (err){
                res.send({'status' :false, 'data' : err });
               }else{
                  res.json({ 'status':false, 'message': "Unlike" , 'data' : post });
                   }
            });   
            }else if(ll.status=='0'){
            ll.userid=req.body.userid;
            ll.postid=req.body.postid;
            ll.status='1'; // for unlike
            ll.save(function(err,post) {
            if (err){
                res.send({'status' :false, 'data' : err });
               }else{
                  res.json({ 'status':true, 'message': "like" , 'data' : post });
                   }
            });   
            }
      
            }else{
            console.log(req.body);
         var post = new Like();
         post.userid=req.body.userid;
         post.postid=req.body.postid;
         post.status='1'; // for like
         post.save(function(err,post) {
         if (err){
             res.send({'status' :false, 'data' : err });
            }else{
              res.send({'status' :true, 'message' : "like", 'data' : post});
         }
        });
//          res.send(err);
 }
  }); 
    }

    });

};