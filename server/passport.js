// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user'),
LocalStrategy = require('passport-local').Strategy;
FacebookStrategy  =     require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./env');

module.exports = function(passport){
	// use static authenticate method of model in LocalStrategy
	passport.use(User.createStrategy());

	// use static serialize and deserialize of model for passport session support
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
        

// code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
//        clientID        : configAuth.facebookAuth.clientID,
//        clientSecret    : configAuth.facebookAuth.clientSecret,
//        callbackURL     : configAuth.facebookAuth.callbackURL
        clientID: "1899964336922371",
    clientSecret: "c39ae58aa549d1dbd527b23affb7192e",
    callbackURL: "http://localhost:8080/auth/facebook/callback",
   // profileFields: ['id', 'displayName', 'photos', 'email','name','profileUrl', 'picture.type(large)']

    profileFields: ['id', 'displayName', 'email','name', 'picture.type(large)']

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
console.log(profile)
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'fbId' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.fbId    = profile.id; // set the users facebook id  
                    newUser.firstname = profile.name.givenName;
                    newUser.lastname = profile.name.familyName;
                    newUser.token = token; // we will save the token that facebook provides to the user                    
               //     newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.image = profile.photos[0].value
//                    newUser.id    = profile.id; // set the users facebook id                   
//                    newUser.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = profile.displayName;
                    newUser.status='1';
                    newUser.role='user';
                    newUser.dob='01/01/2000'
                    
                    
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });
    }));
    




// code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.id    = profile.id;
                    newUser.token = token;
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    newUser.status='1';
                    newUser.role='user';
                    newUser.dob='01/01/2000'
                    
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
