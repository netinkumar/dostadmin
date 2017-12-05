var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	senderid:{type: mongoose.Schema.Types.ObjectId},
	recieverid:{type: mongoose.Schema.Types.ObjectId},
        status:{type: String}, // 0 for send, 1 for received and 2 for pending
        created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Invitefriend', postSchema);