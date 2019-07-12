
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

support_repliesSchema = new Schema({
	support_id:Number,
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    admin_id:Number,
    body:String,
    date:Date,
    ip:String,
    status:Number
}),


support_replies = mongoose.model('support_replies',support_repliesSchema);

module.exports = support_replies;