var mongoose = require('mongoose');
var Schema = mongoose.Schema;

paymentSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    invoice_id:String,
    payment_method:String,
    total:String,
    currency:String,
    transaction_id:String,
    status:Number
}),


payment = mongoose.model('payment',paymentSchema);

module.exports = payment;