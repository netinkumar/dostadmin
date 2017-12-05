
var express = require('express'),
    path = require('path'),
    User = require('./models/user'),
    Contact = require('./models/contact'),
    Like = require('./models/like'),
    Myjob = require('./models/myjob'),
    Invitefriend = require('./models/invitefriend'),
    Subscriber = require('./models/subscriber'),
    Review = require('./models/review'),
    rootPath = path.normalize(__dirname + '/../'),
    apiRouter = express.Router(),
    client = require('twilio')('AC7cbaae38e57be124888e065fe1a273b2', '2ad5290b4d844744e9439ccbd3352196'),
    router = express.Router();

// mail
nodemailer = require('nodemailer'),

    // image upload
    aws = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    dateNow = Date.now();

// mail 
var transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: "AKIAIM2DDFPSHDBWVMKQ",
        pass: "Asmld59kBLOsWzHiSnKp3Ztzn8c6UrRu/KC1waGnHovV"
    }
});

var mailOptions = {
    from: 'ashutosh@avainfotech.com',
    to: 'simerjit@avainfotech.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};
aws.config.update({
    secretAccessKey: 'u47Z3DwzitC5TLfsUk11ynJM8+8n5fARjJ5D86d0',
    accessKeyId: 'AKIAJ3I4K353YIF52FNQ'
});

var s3 = new aws.S3({
    endpoint: 'https://s3.eu-central-1.amazonaws.com',
    region: 'eu-central-1',
    signatureVersion: 'v4',
    ACL: 'public-read',
    //   Bucket: 'dostbucket'
});


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dostbucket',
        key: function (req, file, cb) {
            //console.log(file);
            var flname = file.originalname;
            cb(null, 'blogimage/' + dateNow + '' + flname); //use Date.now() for unique file keys
        }
    })
});
var userupload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dostbucket',
        key: function (req, file, cb) {
            //console.log(file);
            var flname = file.originalname;
            cb(null, 'profilepic/' + dateNow + '' + flname); //use Date.now() for unique file keys
        }
    })
});
var postsUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dostbucket',
        key: function (req, file, cb) {
            //console.log(file);
            var flname = file.originalname;
            cb(null, 'posts/' + dateNow + '' + flname); //use Date.now() for unique file keys
        }
    })
});

var twilio = client.messages.create({
  from: '+6597201069',
  to: '+919041738288',
  body: "You just sent an SMS from Node.js using Twilio!"
}).then((message) => console.log(message.sid));

module.exports = function (app, passport) {
    app.use('/api', apiRouter);
    app.use('/', router);
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });    //added later 


    // API routes
    require('./api/invitefriends')(apiRouter);
    require('./api/posts')(apiRouter, postsUpload);
    require('./api/users')(apiRouter, passport, transporter, userupload,twilio,upload);
    require('./api/contacts')(apiRouter);
    require('./api/subscribers')(apiRouter);
    require('./api/vendortypes')(apiRouter);
    require('./api/vendor_subtypes')(apiRouter);
    require('./api/likes')(apiRouter);
    require('./api/myjobs')(apiRouter);
    require('./api/reviews')(apiRouter);

    // home route
    //	router.get('/', function(req, res) {
    //		res.render('index');
    //	});
    // home route
    router.get('/', function (req, res) {
        //            if (req.isAuthenticated() && req.user.status === '1') {
        if (req.isAuthenticated()) {
            console.log('logged in successfully');
            res.render('index', { user: req.user });
        } else {
            console.log('You are not an admin');
            res.render('index', { user: '' });
        }
    });
    router.get('/home', isLoggedIn, function (req, res) {
        res.render('home/profile', { user: req.user });
    });
    //        router.get('/creategroup', function(req, res) {
    //            res.render('home/creategroup', {user: req.user});
    //        });

    // admin route
    router.get('/admin', function (req, res) {
        res.render('admin/login');
    });

    router.get('/admin/register', function (req, res) {
        res.render('admin/register');
    });

    router.get('/admin/dashboard', isAdmin, function (req, res) {
        res.render('admin/dashboard', { user: req.user });
    });

    router.post('/register', function (req, res) {

        // passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
        User.register(new User({
            email: req.body.email,
            dob: '01/01/1993',
            role: 'admin',
            status: 1
            //name: req.body.name
        }), req.body.password, function (err, user) {
            if (err) {
                console.error(err);
                return;
            }

            // log the user in after it is created
            passport.authenticate('local')(req, res, function () {
                console.log('authenticated by passport');
                res.redirect('/admin/dashboard');
            });
        });
    });
    router.get('/admin/forgot', function (req, res) {
        res.render('admin/forgot_password');
    });
   
    router.get('/invitationcode', function (req, res) {
        res.render('home/code');
    });

    router.get('/verify', function (req, res) {//url for password verification    
        // console.log(req.query.id);
        User.findOne({ '_id': req.query.id }, function (err, user) {
            if (err) {
                res.json('Hmm! Your account is not associated with us!');
            } else {
                user.status = "1";
                user.save(function (err) {
                    if (err) {
                        res.json('Hmm! Your account is not associated with us!');
                    } else {
                        res.json('Your account has been activated');
                    }
                })
            }
        });
    });

    router.post('/login', passport.authenticate('local'), function (req, res) {
        console.log(req)
        res.redirect('/admin/dashboard');
    });

    // website views
    router.get('/forgotpassword', function (req, res) {
        console.log(req.query)
        User.findOne({ 'salt': req.query.id }, function (err, user) {
            if (user == null) {
                res.render('404');
            } else {
                res.render('home/forgotpassword', { salt: req.query.id });
            }
        });
    });
    router.get('/home/logout', function (request, response) {
        request.logout();
        response.redirect('/');
    });
   

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/onlinegroups'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/'
        }));


    // website pages
    router.get('/signup_user', function (req, res) {
        res.render('home/signup_user');
    });
    router.get('/signin', function (req, res) {
        // if (req.user) {
        //     res.redirect('/');
        // } else {
            res.render('home/signin');
       // }
    });

    router.get('/changepassword', function (req, res) {
         res.render('home/changepassword');
    });
    router.get('/signup_vendor', function (req, res) {
        res.render('home/signup_vendor');
    });
    router.get('/aboutus', function (req, res) {
        res.render('home/aboutus');
    });
    router.get('/vendor_process', function (req, res) {
        res.render('home/vendor_process');
    });
    router.get('/list', function (req, res) {
        res.render('home/list');
    });
    router.get('/aboutus', function (req, res) {
        res.render('home/aboutus');
    });
    router.get('/postjob', function (req, res) {
        res.render('home/postjob');
    });
    router.get('/verifycode', function (req, res) {
        res.render('home/verifycode');
    });
    router.get('/user', function (req, res) {
        res.render('home/user');
    });
    router.get('/vendor_view', function (req, res) {
        res.render('home/vendor_view');
    });
    router.get('/vendor_detail', function (req, res) {
        res.render('home/vendor_detail');
    });
    router.get('/editbasicinfo', function (req, res) {
        res.render('home/editprofile');
    });
     router.get('/apihtml', function (req, res) {
        res.render('home/apihtml');
    });
   


    router.get('/restapi', function (req, res) {
        res.render('home/restapi');
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    //    app.get('/editprofile', isLoggedIn, function(req, res) {
    //        res.render('home/edit_profile', {
    //            user : req.user // get the user out of session and pass to template
    //        });
    //    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }




    app.use(function (req, res, next) {
        res.status(404);

        res.render('404');
        return;
    });

};

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.phone === '9041738288') {
        console.log('cool you are an admin, carry on your way');
        next();
    } else {
        console.log('You are not an admin');
        res.redirect('/admin');
    }
}