
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

user_addressSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    address1:String,
    address2:String,
    city:String,
    state:String,
    country:String,
    zip:String,
    status:Number
}),


user_address = mongoose.model('user_address',user_addressSchema);

module.exports = user_address;