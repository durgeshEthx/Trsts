var mongoose = require('mongoose');
var Schema = mongoose.Schema;

signeeSchema = new Schema({
	
    document_id: {type:mongoose.Schema.Types.ObjectId , ref : 'documents'},
    signee_uid: {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    status:Number
}),


signee = mongoose.model('signee',signeeSchema);

module.exports = signee;