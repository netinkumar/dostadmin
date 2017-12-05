var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
	email: {
		type: String, 
		required: '{PATH} is required!'
	},
        message:{type: String,required:'{PATH} is required!'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Contact', postSchema);