var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String, required: '{PATH} is required!'},
        others: { type: Boolean },
        multiple: { type: Boolean, required: '{PATH} is required!'},
        services : {type: Array },
        addons : {type: String },
        highlights : {type: String },
        more_addons : {type: Boolean, required: '{PATH} is required!'},
        more_highlights : {type: Boolean, required: '{PATH} is required!'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Vendortype', postSchema);