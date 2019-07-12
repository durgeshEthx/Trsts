var mongoose = require('mongoose');
var Schema = mongoose.Schema;

invoiceSchema = new Schema({
	
    uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    plan:String,
    description:String,
    amount:String,
    tax:String,
    total:String,
    currency:String,
    status:Number
   
}),


invoice = mongoose.model('invoice',invoiceSchema);

module.exports = invoice;