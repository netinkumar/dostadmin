var Invitefriend = require('../models/invitefriend');
var User = require('../models/user');
var FCM = require('fcm-node');
var serverKey = 'AAAA1vz2vt4:APA91bHiGSNbpDV5KfWNsKLgxoAMmT1jpitzROZ_6wliU1dR2Tje-Q2ZyA2u_qZRi7iJf2sVI4_IEO42WCtCIyhU56z9WimV0REfX3NGa3AXg93WyJ78eQnYE-QuRWonCydPOLvfnM_P'; //put your server key here 
var fcm = new FCM(serverKey);
// Users API
module.exports = function(apiRouter) {

apiRouter.post('/invitefriends/invite', function(req, res) {
    if(!req.body.email){
          if(!req.body.phone){
               res.json({ 'status': false, 'message': 'Phone Number not found' });
          }else{
             console.log(req.body.email);
            console.log('test');
              User.findOne({'phone':req.body.phone},function(err, usr){
                  if(usr._id==req.body.senderid){
                       res.send({'message' : "Not Possible", 'status' : false });
                  }else{
                        if (usr) {
                       var invitefriend = new Invitefriend();
                        invitefriend.senderid = req.body.senderid;
                        invitefriend.status = 0; // for send invitation
                        invitefriend.recieverid = usr._id;
                     // save the user
                    invitefriend.save(function(err,users) {
                        if (err){
                              res.send({'message' : "not invited", 'status' : false });
                        }else{
                              res.send({'message' : "invited", 'status' : true, 'data' : users });
                        }
                           });
                }else{
                      res.send({'message' : "Phone Number not Exist", 'status' : false });
               }   
                  }
            
           });
          }
    }else{
        if(!req.body.senderid)
        {
             res.json({ 'status': false, 'message': 'Sender id not found' });
        }else{
            console.log(req.body.email);
            console.log('test');
              User.findOne({'email':req.body.email},function(err, usr){
                      if(usr._id==req.body.senderid){
                       res.send({'message' : "Not Possible", 'status' : false });
                  }else{
                      if (usr) {
                       var invitefriend = new Invitefriend();
                        invitefriend.senderid = req.body.senderid;
                        invitefriend.status = 0; // for send invitation
                        invitefriend.recieverid = usr._id;
                     // save the user
                    invitefriend.save(function(err,users) {
                        if (err){
                              res.send({'message' : "not invited", 'status' : false });
                        }else{
                                var push_token =usr.device_token;
                                console.log(push_token);
                                   var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
                                       to: push_token, 
                                       collapse_key: '',

                                       notification: {
                                           title: 'Title of your push notification', 
                                           body: 'Body of your push notification' 
                                       }
                                   };

                                   fcm.send(message, function(err, response){
                                       if (err) {
                                           console.log("Something has gone wrong!");
                                  return false;
                                       } else {
                                           console.log("Successfully sent with response: ", response);
                                           res.send({'message' : "invited", 'status' : true, 'data' : users });
                               //   return true;
                                       }
                                   });
                             
                        }
                           });
                 console.log("00001");
               }else{
                      res.send({'message' : "Email Address not Exist", 'status' : false });
               }   
           }
           });
        }

    }
apiRouter.post('/post_fcm_app', function(req, res) {
   
    var push_token = req.body.push_token;
 console.log(push_token);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to: push_token, 
        collapse_key: '',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
   return false;
        } else {
            console.log("Successfully sent with response: ", response);
   return true;
        }
    });
});
    });

};