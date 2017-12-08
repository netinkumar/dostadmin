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
        profile_:{type: String},
        email:{type: String},
        find_us:{type: String},
        device_token:{type: String},
        fbId:{type: String},
        googleId:{type: String},
        role:{type: String,required:'{PATH} is required!'},
        status:{type: String,required:'{PATH} is required!'},
        // vendor info 
        end_hours:{type: String},
        start_hours:{type: String},
        about_us:{type:String},
        address:{type: String},
        location:{type: String},
        company_name:{type: String},
        gallery:{type: mongoose.Schema.Types.Mixed},
        vendor_type:{type:String},
        vendor_type_id:{type:String,required:'{PATH} is required!'},
        establishment_year:{type: String},
        facebook_username:{type: String},
        twitter_username:{type: String},
        instagram_username:{type: String},
        awards:{type: String},
        discount:{type: String},
        discount_amount:{type: String},
        effective_date:{type: String},
        product_detail:{type: String},
        addon:{type: String},
        additional_addon:{type: String},
        highlights:{type: String},
        additional_highlights:{type: String},
        additional_services:{type: String},
        services:{type: String},
        subvendortypes : {type: String},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'phone' });

module.exports = mongoose.model('User', User);