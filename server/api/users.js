
var User = require('../models/user');
var client = require('twilio')('AC7cbaae38e57be124888e065fe1a273b2', '2ad5290b4d844744e9439ccbd3352196');
var copyFile = require('quickly-copy-file');
var uuid = require('node-uuid');
var fs = require('fs');
var url = require('url') ;
var http = require('http');
var request = require('request');


//var Subscribe = require('../models/subscribe');
// Users API
module.exports = function(apiRouter, passport, transporter,userupload,twilio,upload) {
    
    // find if user exists else add new user
//    apiRouter.post('/fbUser',function(req,res){
//        User.findOne({ 'fbId': req.body.email },function(err,user){
//            if(err) return res.send(err)
//            
//            if(user){
//             res.send('User already exist')   
//            }else{
//                User.register(new User({
//                    dob: req.body.dob,
//                    status: 1,
//                    role: 'user',
//                    email: req.body.email,
//                    fbId:req.body.fbId
//                }), req.body.password, function(err, user) {
//                    if (err) {
//                        console.error(err.message);
//                        res.send(err.message);
//                    } else {
//                        res.send("You have successfully added user");
//                    }
//
//                });
//            }
//        })
//    });

    // get all posts
    apiRouter.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });
    // add a post
    apiRouter.post('/users', function(req, res) {

        User.register(new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: req.body.dob,
            status: req.body.status,
            role: req.body.role,
            email: req.body.email
        }), req.body.password, function(err, user) {
            if (err) {
                console.error(err.message);
                res.send(err.message);
            } else {
                res.send("You have successfully added user");
            }

        });
    });

    // get vendor by vendor_type
    apiRouter.post('/users/getvendorbytype', function (req, res) {
        console.log(req.body.vendor_type)
        var type = req.body.vendor_type
        User.find({'vendor_type': type }, function(err, users) {
            if (err)
                res.send(err);
                if(users.length == 0 ) {
                     res.json({status : false, message: 'No data found.'});
                } else {
                     res.json({status : true, data: users});
                }
        });
    });
//    get vendor/user by id
     apiRouter.post('/users/userdetails', function (req, res) {
        console.log(req.body.vendor_type)
     
        User.findById({ '_id': req.body._id }, function (err, user) {
            if (err)
                res.send(err);
                if(user.length == 0 ) {
                     res.json({status : false, message: 'No data found.'});
                } else {
                     res.json({status : true, data: user});
                }
        });
    });
    // getallvendors
    apiRouter.post('/users/getallvendors', function (req, res) {
        console.log(req.body.role)
        var type = req.body.role;
        var page = req.body.page;
        var perPage = 15
        User.find({'role': type}).skip((perPage * page) - perPage).limit(perPage).exec(function(err, users) {
             User.count().exec(function(err, count) {
                if (err)
                res.send(err);
                if(users.length == 0 ) {
                     res.json({status : false, message: 'No data found.'});
                } else {
//                     res.json({status : true, data: users});
                     res.json({'page':Math.ceil(count / perPage),'current':page,status : true, data: users});
                }
                console.log(users);
                 
            })
           
        });
    });
    
    apiRouter.post('/users/home', function(req, res) {
        User.findOne({'phone': req.body.phone },function(err,user){
            if(user){
                res.send({'status':false,'message':"Phone number already registered with us."});
            }else{
                console.log(req.body.vendor_type);
                User.register(new User({
                    name: req.body.name,
                    company_name: req.body.company_name,
                    phone:req.body.phone,
                    address:req.body.address,
                    location:req.body.location,
                    find_us:req.body.find_us,
                    status: 1,  //will change from admin
                    role: req.body.role,
                    vendor_type:req.body.vendor_type,
                    vendor_type_id:req.body.vendor_type_id,
                    friend_invitcode:req.body.friend_invitcode
                }), req.body.password, function(err, usr) 
                { 
                  if (err){  
                       res.send(err.message); 
                  } else {
                    var test=usr._id+usr.company_name;
                    console.log(test.substr(13, 4));
                    usr.invitecode= test.substr(13, 4);
                    usr.save(function(err) {
                    // if (err){
                    // res.send(err);}else{
                    // res.json({'status':true,'message':'User updated!'});
                    //}
                    });
                    res.send({'status':true,'message':"You have successfully registered.",'data':usr});
                  }
                });
            } 
        }); 
    });
    
    apiRouter.post('/users/forgetpass', function (req, res) {
        User.findOne({ 'email': req.body.email }).select('+salt +hash').exec(function (err, usr) {
            if (usr) {
                host = req.get('host');//remember the server (i.e host) address
                link = "http://" + req.get('host') + "/forgotpassword?id=" + usr._id;//create a url of the host server
                var mailOptions = {
                    from: 'simerjit@avainfotech.com',
                    to: usr.email,
                    subject: 'Forgot Password',
                    html: "Hello " + usr.email + ",<br> Please Click on the link to change password.<br><a href=" + link + ">Click here to Change Password</a>"
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send({ 'status': false, message: 'Email has not been sent!' });
                        //    res.json("Email has not been sent!");
                    } else {
                        res.send({ 'status': true, message: 'Email has been sent please check your email!' });
                    }
                });
            } else {
                res.json("Email has not been registered!");
            }

        });
    });
    // apiRouter.post('/users/changepass', function (req, res) {
    //     console.log('changepass')
    //     console.log(req.body)
    //     User.findOne({ '_id': req.body.id }, function (err, sanitizedUser) {
    //         // console.log(sanitizedUser);
    //         if (sanitizedUser) {
    //             sanitizedUser.setPassword(req.body.password, function () {
    //                 sanitizedUser.save();
    //                 res.send({ 'status': true, message: 'Password has been updated successfully!' });
    //             });
    //         } else {
    //             res.send({ 'status': false, message: 'user does not exist' });
    //         }
    //     });
    // });
    // guest change the password
    apiRouter.post('/users/guest/changepassword', function (req, res) {
        console.log('changepassword')
        // console.log(req.body)
        User.findOne({ '_id': req.body.id }, function (err, sanitizedUser) {
            // console.log(sanitizedUser);
            if (sanitizedUser) {
                sanitizedUser.setPassword(req.body.password, function () {
                    sanitizedUser.save();
                    res.send({ 'status': true, message: 'Password has been updated successfully!' });
                });
            } else {
                res.send({ 'status': false, message: 'user does not exist' });
            }

        });

    });
  apiRouter.post('/users/resetpassword', function (req, res) {
      console.log(req.body)
      //      User.findOne({'_id': req.body.id}, function(err, sanitizedUser) {  
      User.findOne({ '_id': req.body.id }, function (err, sanitizedUser) {
          // console.log(sanitizedUser);
          if (sanitizedUser) {
              sanitizedUser.setPassword(req.body.password, function () {
                  sanitizedUser.save();
                  res.send({ 'status': true, message: 'Password has been updated successfully!' });
              });
          } else {
              res.send({ 'status': false, message: 'user does not exist' });
          }

      });

  });

    // for website
    apiRouter.post('/users/login', function (req, res, next) {
        User.findOne({ 'phone': req.body.phone }, function (err, users) {
            passport.authenticate('local', function (err, user, info) {
                // Redirect if it fails
                console.log(info);
                if (!user) {
                    console.log(info);

                }
                req.logIn(user, function (err1) {
                    if (err1) {
                        return res.json({ status: false, data: info});
                    } else {
                        User.findById({ '_id': req.user._id }, function (err, user) {
                            if (err)
                                res.send(err);
                            // user.device_token = req.body.device_token;
                            user.save(function (err) {
                                if (err)
                                    res.send(err);
                            });
                        });
                        res.json({ status: true, data: req.user });
                    }
                });
            })(req, res, next);
        });
    });
    

    // for application
     apiRouter.post('/users/login1', function(req, res, next) {
          User.findOne({'phone': req.body.phone}, function(err, users) {
            passport.authenticate('local', function(err, user, info) {
                // Redirect if it fails
                  console.log(info);
                  if (!user) { 
                      console.log(info);
                      
                  }  
                    req.logIn(user, function(err) {
                    if (err) { 
                        return res.json(info);
                    }else{
                    User.findById({'_id': req.user._id}, function(err, user) {
                        if (err)
                        res.send(err);
                        user.device_token = req.body.device_token;
                        user.save(function(err) {
                               if (err)
                           res.send(err);
                            });
                       });
                          res.json({ status : true, data : req.user});
                    }
                    });
                })(req, res, next);
          });
/*                passport.authenticate('local', function(err, user, info) {
                 
                  // Redirect if it fails
                  console.log(info)
                  if (!user) { 
                      console.log(info)
                        if (err) { return res.json(info); }
                  }  
                  req.logIn(user, function(err) {
                    if (err) { return res.json(info); }
                    res.json({ status : true, data : req.user});
                  });
                })(req, res, next);*/
    });
    
   apiRouter.post('/users/signin', function(req, res, next) {
                passport.authenticate('local', function(err, user, info) {
                 
                  // Redirect if it fails
                  if (!user) { 
                      console.log('User doesnt exist')
                        if (err) {
                            console.log(err)
                              res.json({ status : false, message:res.json(info)+'ppp'});
                          //  return res.json(info); 
                        }
                  }  
                  req.logIn(user, function(err) {
                      console.log('User exists')
                    if (err) { 
                        console.log(err)
                         res.json({ status : false, message:'error..'+res.json(info)});
                       // return res.json(info); 
                    }
                    res.json({ status : true, data : req.user, message:'You have Successfully LoggedIn'});
                  });
                }) (req, res, next);
    })
    // get a single post
    apiRouter.post('/edituser', function(req, res) {
        User.findById({'_id': req.body.path}, function(err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });
    });

    // update a post
    apiRouter.post('/editusrID', function(req, res) {
        //console.log(req.body);
        User.findById({'_id': req.body.id}, function(err, user) {
            if (err)
                res.send(err);
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.image = req.body.image;
            //user.pin = req.body.pin;
            user.phone = req.body.phone;
            user.address = req.body.address;
            //user.country = req.body.country;
            user.dob = req.body.dob;
            user.role = req.body.role;
            user.status = req.body.status;
            user.save(function(err) {
                if (err){
                    res.send(err);}else{
                res.json({'status':true,'message':'User updated!'});
            }
            })

        });
    });
        // update a post
    apiRouter.post('/editusrhome', function(req, res) {
        //console.log(req.body);
        User.findById({'_id': req.body.id}, function(err, user) {
            if (err)
                res.send(err);
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.gin = req.body.gin;
            user.pin = req.body.pin;
            user.phone = req.body.phone;
            user.address = req.body.address;
            user.country = req.body.country;
            user.dob = req.body.dob;
            user.profilepic = req.body.profilepic;
            user.doca = req.body.doca;
            user.docb = req.body.docb;
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json('User updated!');
            })

        });
    });
    apiRouter.post('/users/uploaduserimage',userupload.array('file',3), function(req, res, next) {
       // console.log(req.body);
        console.log(req.files);
        res.send(req.files);
    });
     apiRouter.post('/users/gallaryimage',upload.array('file',3), function(req, res, next) {
       // console.log(req.body);
        console.log(req.files);
        res.send(req.files);
    });
    // delete a user
    apiRouter.post('/deleteuser', function(req, res) {
        User.remove({
            _id: req.body.id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({message: 'User deleted!'});
        })
    });
    
    // get all organizers

// new


    apiRouter.post('/users/savebasicinfo_new', function (req, res) {
        console.log('jmnjm');
        console.log(req.body);
        console.log("test");
        User.findById({ '_id': req.body.id }, function (err, user) {
            if (err) {
                res.json({ 'status': false, 'message': err });
            } else {
                console.log(user);
                console.log(req.body.phone);
                console.log("babita");
                if (req.body.phone == undefined) {
                    console.log("if");
                    req.body.phone = user.phone;
                } else {
                    console.log("else");
                    req.body.phone = req.body.phone;
                }
                if (user.phone == req.body.phone) {
                    console.log("match");
                    user.establishment_year = req.body.establishment_year;
                    user.eworking_hours = req.body.eworking_hours;
                    user.sworking_hours = req.body.sworking_hours;
                    user.facebook_username = req.body.facebook_username;
                    user.twitter_username = req.body.twitter_username;
                    user.instagram_username = req.body.instagram_username;
                    user.location = req.body.location;
                    user.email = req.body.email;
                    user.discount_amount = req.body.discount_amount;
                    user.effective_date = req.body.effective_date;
                    user.product_detail = req.body.product_detail;
                    user.awards = req.body.awards;
                    user.minimum_guest = req.body.minimum_guest;
                    user.maximum_guest = req.body.maximum_guest;
                    user.company_name = req.body.company_name;
                    user.vendor_type = req.body.vendor_type;
                    user.phone = req.body.phone;
                    user.about_us = req.body.about_us
                    user.gallery_image = req.body.gallery
                    if(!req.body.about_us){
                         user.about_us = '';
                    }
                    if (req.body.services) {
                        user.services = JSON.parse(req.body.services)
                    }
                    if (req.body.price_per_plate) {
                        user.price_per_plate = JSON.parse(req.body.price_per_plate);
                    }
                    if (req.body.additionalservices) {
                        user.additionalservices = JSON.parse(req.body.additionalservices)
                    }
                    user.addon = JSON.parse(req.body.addon);
                    user.highlights = JSON.parse(req.body.highlights);
                    user.discount = JSON.parse(req.body.discount);
                    if(user.gallery_image){
                         user.gallery_image = JSON.parse(req.body.gallery);
                    }
                   
                    if (req.body.additional_addon.length > 0) {
                        user.additional_addon = JSON.parse(req.body.additional_addon);
                    }
                    if (req.body.additional_highlights.length > 0) {
                        user.additional_highlights = JSON.parse(req.body.additional_highlights);
                    }
                    if (req.body.additional_discounts != 'undefined') {
                        user.additional_discounts = JSON.parse(req.body.additional_discounts);
                    }
                    console.log(req.body);
                    console.log('test');
                    user.save(function (err1) {
                        if (err1) {
                            res.json({ 'status': false, 'message': err1 });
                            //res.send(err);
                        } else {
                            res.json({ 'status': true, 'message': 'User info saved', 'data': user, 'exists': 1 });

                        }
                    });
                } else {

                    console.log("mismatch");
                    user.establishment_year = req.body.establishment_year;
                    user.eworking_hours = req.body.eworking_hours;
                    user.sworking_hours = req.body.sworking_hours;
                    user.facebook_username = req.body.facebook_username;
                    user.twitter_username = req.body.twitter_username;
                    user.instagram_username = req.body.instagram_username;
                    user.location = req.body.location;
                    user.email = req.body.email;
                    user.discount_amount = req.body.discount_amount;
                    user.effective_date = req.body.effective_date;
                    user.product_detail = req.body.product_detail;
                    user.awards = req.body.awards;
                    user.minimum_guest = req.body.minimum_guest;
                    user.company_name = req.body.company_name;
                    user.vendor_type = req.body.vendor_type;
                    user.phone = req.body.phone;
                    if (req.body.services) {
                        user.services = JSON.parse(req.body.services);
                    }
                    if (req.body.price_per_plate) {
                        user.price_per_plate = JSON.parse(req.body.price_per_plate);
                    }
                    if (req.body.additionalservices) {
                        user.additionalservices = JSON.parse(req.body.additionalservices)
                    }
                    user.addon = JSON.parse(req.body.addon);
                    user.highlights = JSON.parse(req.body.highlights);
                    user.discount = JSON.parse(req.body.discount);
                    user.gallery_image = JSON.parse(req.body.gallery);
                    if (req.body.additional_addon.length > 0) {
                        user.additional_addon = JSON.parse(req.body.additional_addon);
                    }
                    if (req.body.additional_highlights.length > 0) {
                        user.additional_highlights = JSON.parse(req.body.additional_highlights);
                    }
                    if (req.body.additional_discounts != 'undefined') {
                        user.additional_discounts = JSON.parse(req.body.additional_discounts);
                    }
                    user.save(function (err1) {
                        if (err1) {
                            console.log("sdasd");
                            res.json({ 'status': false, 'message': err1 });
                            //res.send(err);
                        } else {
                            console.log("chchchc");
                            var dataString = 'api_key=2BdppFFx4ZU4301BQiEvCKy1jbX3VeMP&via=sms&phone_number=' + req.body.phone + '&country_code=91';

                            var options = {
                                url: 'https://api.authy.com/protected/json/phones/verification/start',
                                method: 'POST',
                                body: dataString
                            };

                            function callback(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log(body);
                                    console.log(response);
                                    if (JSON.parse(body).success == true) {
                                    }
                                } else {
                                    console.log("bb");
                                }
                            }
                            request(options, callback);
                            res.json({ 'status': true, 'message': 'User updated! Verify Phone Number', 'data': user, 'exists': 0 });
                        }
                    })
                }
            }
        });
    });  

//end



    // old
//     apiRouter.post('/users/savebasicinfo', function(req, res) {
//         console.log('jmnjm');
//         console.log(req.body);
//         console.log("test");
//         User.findById({'_id':req.body.id}, function(err, user) {
           
//                if(err){
//                       res.json({'status':false,'message': err});
//                      }else{
//                //   console.log(req.body.additional_highlights);
//                    // console.log(req.body.additional_addon);
//               //      console.log(JSON.parse(req.body.additionalservices));
                    
//               //console.log(JSON.parse(req.body.price_per_plate));
//                console.log('returned User')
//               // console.log(req.body.additional_discounts);
//                console.log("babita")
//              //   user.phone = req.body.phone;
//                 user.establishment_year = req.body.establishment_year;
//                 user.working_hours = req.body.working_hours;
//                 user.facebook_username = req.body.facebook_username;
//                 user.twitter_username = req.body.twitter_username;
//                 user.instagram_username = req.body.instagram_username;
//                 user.location = req.body.location;
//                 user.email = req.body.email;
//                 user.discount_amount = req.body.discount_amount;
//                 user.effective_date = req.body.effective_date;
//                 user.product_detail = req.body.product_detail;
//                 user.awards = req.body.awards;
//                 user.minimum_guest= req.body.minimum_guest;
//                 if(req.body.services){
//                 user.services=JSON.parse(req.body.services)
//                 }
//                    if(req.body.price_per_plate){
//                 user.price_per_plate=JSON.parse(req.body.price_per_plate);
//                   }
//                  if(req.body.additionalservices){
//                    user.additionalservices=JSON.parse(req.body.additionalservices)
//                  }
// //                if(req.body.addon.length>0){
//                 user.addon = JSON.parse(req.body.addon);
              
// //                  }
// //               if(req.body.highlights.length>0){
//                 user.highlights = JSON.parse(req.body.highlights);
// //                  }
// //               if(req.body.discount.length>0){
//                  user.discount =JSON.parse(req.body.discount);
// //                  }
// //               if(req.body.gallery.length>0){
//                        user.gallery_image=JSON.parse(req.body.gallery);
// //               }
//                 if(req.body.additional_addon.length>0){
//                       user.additional_addon=JSON.parse(req.body.additional_addon);
//                }
//                 if(req.body.additional_highlights.length>0){
//                     user.additional_highlights=JSON.parse(req.body.additional_highlights);
//                }
//                if(req.body.additional_discounts !='undefined'){
//                      user.additional_discounts=JSON.parse(req.body.additional_discounts);
//                }
//                //      user.addon={ thing: 'i want' } ;
//                 user.save(function(err1) {
//                     if (err1){
//                      res.json({'status':false,'message': err1});
//                         //res.send(err);
//                     }else{
//                         res.json({'status':true,'message':'User updated!','data':user});
//                     }
//                 })
//             } 
            
//         });
//     });  
//    apiRouter.post('/upload', function(req, res) {
//        //console.log(req.body);
//        
////    var AWS = require('aws-sdk');
////    AWS.config.loadFromPath('./s3_config.json');
////    var s3Bucket = new AWS.S3( { params: {Bucket: 'myBucket'} } );
//    buf = new Buffer(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),'base64')
//    var data = {
//    _id: req.body.userId, 
//    Body: buf,
//    ContentEncoding: 'base64',
//    ContentType: 'image/jpeg'
//    };
//    s3.putObject(data, function(err, data){
//        if (err) { 
//          console.log(err);
//          console.log('Error uploading data: ', data); 
//        } else {
//          console.log('succesfully uploaded the image!');
//        }
//    });
//
//    });    
    apiRouter.post('/users/singleuser', function(req, res) {
          User.findById({'_id':req.body.id}, function(err, user) {
             if(err){
              res.send({'status':false,'message':"No data found!"});
             }else{
                res.send({'status':true,'data':user});
                 }
             });
    });
         
  
apiRouter.post('/users/checkcode', function (req, res) {
    User.findById({ '_id': req.body.id }, function (err, user) {
        if (err) {
            res.json({ 'status': false, 'message': err });
        } else {
            var options = {
                url: 'https://api.authy.com/protected/json/phones/verification/check?api_key=2BdppFFx4ZU4301BQiEvCKy1jbX3VeMP&phone_number=' + user.phone + '&country_code=91&verification_code=' + req.body.code
            };
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    if (JSON.parse(body).success == true) {
                        User.findById({ '_id': req.body.id }, function (err, user) {
                            if (err) {
                                res.json({ 'status': false, 'message': err });
                            } else {
                                user.status = 1,
                                    user.save(function (err1) {
                                        res.json({ 'status': true, 'data': JSON.parse(body) });
                                    });
                            }
                        });
                    }
                } else {
                    res.json({ 'status': false, 'message': 'Incorrect Verification Code' });
                }
            }
            request(options, callback);
        }

    });
});

/////// after googleplus and fb login  add phone number verification and add vendor type /////
apiRouter.post('/users/addpending', function (req, res) {
    console.log('jmnjm');
    console.log(req.body);
    console.log("test");
    User.findById({ '_id': req.body.id }, function (err, user) {
        if (err) {
            res.json({ 'status': false, 'message': err });
        } else {
            console.log(user);
            console.log("bbbb");
            user.phone = req.body.phone;
            user.status = 1;
            user.vendor_type = req.body.vendor_type;
            user.country_code = '+91';
            user.save(function (err1) {
                if (err1) {
                    res.json({ 'status': false, 'message': err1 });
                    //res.send(err);
                } else {
                    res.json({ 'status': true, 'message': 'User Added!', 'data': user });
                    var dataString = 'api_key=2BdppFFx4ZU4301BQiEvCKy1jbX3VeMP&via=sms&phone_number=' + req.body.phone + '&country_code=91';

                    var options = {
                        url: 'https://api.authy.com/protected/json/phones/verification/start',
                        method: 'POST',
                        body: dataString
                    };

                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                            console.log(response);
                            if (JSON.parse(body).success == true) {
                            }
                        } else {
                            console.log("bb");
                        }
                    }

                    request(options, callback);
                }
            })
        }

    });
});

};