var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: { type: String, required: '{PATH} is required!'},
	cost: { type: String},
        time: { type: String},
        location:{type: String},
        special_needs: { type: String},
        description: { type: String},
        image: { type: String},
        posted_by:{type: mongoose.Schema.Types.ObjectId},
        //post_type:blog/job
        post_type:{type: String, required: '{PATH} is required!'},
        slug: { type: String},
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Post', postSchema);