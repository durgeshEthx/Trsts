var mongoose = require('mongoose');
var Schema = mongoose.Schema;

wallet_addressSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    address:String,
    status:Number
}),


wallet_address = mongoose.model('wallet_address',wallet_addressSchema);

module.exports = wallet_address;