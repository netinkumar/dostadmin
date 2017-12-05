var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	userid:{type: mongoose.Schema.Types.ObjectId},
	postid:{type: mongoose.Schema.Types.ObjectId},
        status:{type: String}, // 1for accept //2 for bid
        title: { type: String},
	cost: { type: String},
        time: { type: String},
        location:{type: String},
        slug: { type: String},
        special_needs: { type: String},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Myjob', postSchema);