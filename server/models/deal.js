var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	vendor_id: { type: mongoose.Schema.Types.ObjectId},
        deal: { type: mongoose.Schema.Types.Mixed},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Deal', postSchema);