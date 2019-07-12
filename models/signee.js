var mongoose = require('mongoose');
var Schema = mongoose.Schema;

signeeSchema = new Schema({
	
    document_id:String,
    signee_uid:String,
    status:Number
}),


signee = mongoose.model('signee',signeeSchema);

module.exports = signee;