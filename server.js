const accountSid = 'AC7cbaae38e57be124888e065fe1a273b2';
const authToken = '2ad5290b4d844744e9439ccbd3352196';
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    client = require('twilio')(accountSid,authToken);
    app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    envConfig = require('./server/env')[env];
console.log(envConfig)
mongoose.connect(envConfig.db);

// PASSPORT CONFIG
require('./server/passport')(passport);

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


// ROUTES
require('./server/routes')(app, passport);

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});