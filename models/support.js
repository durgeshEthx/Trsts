var mongoose = require('mongoose');
var Schema = mongoose.Schema;

supportSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    subject:String,
    body:String,
    date:Date,
    ip:String,
    is_admin:Number,
    status:Number
}),


support = mongoose.model('support',supportSchema);

module.exports = support;