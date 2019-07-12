var mongoose = require('mongoose');
var Schema = mongoose.Schema;

signSchema = new Schema({
	
    signee_uid:String,
    document_id:String,
    sign_location_id:String,
    value:String,
    image:String,
    ip:String,
    host:String,
    date:Date,
    blockchain_ethxid:String,
    blockchain_datatype:String,
    blockchain_datavalue:String,
    blockchain_added:Number,
    blockchain_tx:String,
    blockchain_fees:String,
    status:Number
}),


sign = mongoose.model('sign',signSchema);

module.exports = sign;