var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	phone: {
		type: String, 
		required: '{PATH} is required!',
                unique : true
	},
        invitecode:{type: String},
	name:{type: String},
        friend_invitcode:{type: String},
        company_name:{type: String},
        profile_:{type: String},
        gallery:{type: mongoose.Schema.Types.Mixed},
        email:{type: String},
        address:{type: String},
        location:{type: String},
        find_us:{type: String},
        fbId:{type: String},
        googleId:{type: String},
        role:{type: String,required:'{PATH} is required!'},
        status:{type: String,required:'{PATH} is required!'},
        // vendor info 
        about_us:{type:String},
        vendor_type:{type:String},
        vendor_type_id:{type:String,required:'{PATH} is required!'},
        description:{type: String},
        working_hours:{type: String},
        facebook_username:{type: String},
        twitter_username:{type: String},
        instagram_username:{type: String},
        awards:{type: String},
        device_token:{type: String},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// Passport-Local-Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value
// bcrypt middleware
//usersSchema.pre('save', function(next){
//    var user = this;
//
//    //check if password is modified, else no need to do anything
//    if (!user.isModified('pass')) {
//       return next()
//    }
//
//    user.pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//    next()
//})

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'phone' });

module.exports = mongoose.model('User', User);