var mongoose = require('mongoose');
var Schema = mongoose.Schema;

document_sign_locSchema = new Schema({
	
    document_id:String,
    signee_uid:String,
    placeholder_type:String,
    placeholder_location:String,
    status:Number   
}),


document_sign_loc = mongoose.model('document_sign_loc',document_sign_locSchema);

module.exports = document_sign_loc;