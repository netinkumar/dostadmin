var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	userid:{type: mongoose.Schema.Types.ObjectId},
	postid:{type: mongoose.Schema.Types.ObjectId},
        status:{type: String},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Like', postSchema);