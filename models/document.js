var mongoose = require('mongoose');
var Schema = mongoose.Schema;

documentSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    trstsid:String,
    title:String,
    comments:String,
    location:String,
    date:{ type: Date, default: Date.now() },
    ip:String,
    status:Number
}),


documents = mongoose.model('documents',documentSchema);

module.exports = documents;