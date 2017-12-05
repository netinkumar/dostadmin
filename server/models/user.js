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
        image:{type: String},
        gallery_image:{type: mongoose.Schema.Types.Mixed},
        email:{type: String},
        address:{type: String},
        location:{type: String},
        find_us:{type: String},
        fbId:{type: String},
        googleId:{type: String},
        maximum_guest:{type: String},
        price_per_plate:{type: mongoose.Schema.Types.Mixed},
        minimum_guest:{type: String},
        role:{type: String,required:'{PATH} is required!'},
        status:{type: String,required:'{PATH} is required!'},
        additional_addon:{type: mongoose.Schema.Types.Mixed},
        additional_highlights:{type: mongoose.Schema.Types.Mixed},
        additional_discounts:{type: mongoose.Schema.Types.Mixed},
        // vendor info 
        about_us:{type:String},
        establishment_year:{type:String},
        working_hours:{type:String},
        eworking_hours:{type:String},
        sworking_hours:{type:String},
        awards:{type:String},
        vendor_type:{type:String},
        description:{type: String},
        establishment_year:{type: String},
        working_hours:{type: String},
        facebook_username:{type: String},
        twitter_username:{type: String},
        instagram_username:{type: String},
        awards:{type: String},
        device_token:{type: String},
        product_detail:{type: String},
        effective_date:{type: String}, 
        discount_amount:{type: String},
        additionalservices: { type: mongoose.Schema.Types.Mixed},
        services: { type: mongoose.Schema.Types.Mixed},
        addon: { type: mongoose.Schema.Types.Mixed},
        additinaladdon: { type: mongoose.Schema.Types.Mixed},
        highlights: { type: mongoose.Schema.Types.Mixed},
        discount: { type: mongoose.Schema.Types.Mixed},
        shop_location: { type: mongoose.Schema.Types.Mixed},
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