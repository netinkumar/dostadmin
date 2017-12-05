var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String, required: '{PATH} is required!'},
        vendortype: { type: String, required: '{PATH} is required!'},
        vendortype_id: { type: String, required: '{PATH} is required!'},
        multiple: { type: Boolean, required: '{PATH} is required!'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Vendor_subtype', postSchema);