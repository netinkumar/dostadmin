var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	vendor_id: { type: mongoose.Schema.Types.ObjectId},
        services: { type: mongoose.Schema.Types.Mixed},
        gallery: { type: mongoose.Schema.Types.Mixed},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Highlight', postSchema);