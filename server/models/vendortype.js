var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String, required: '{PATH} is required!'},
        others: { type: Boolean },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Vendortype', postSchema);