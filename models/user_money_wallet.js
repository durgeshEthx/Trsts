var mongoose = require('mongoose');
var Schema = mongoose.Schema;

user_money_walletSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    amount:String,
    currency:String,
    status:Number
}),


user_money_wallet = mongoose.model('user_money_wallet',user_money_walletSchema);

module.exports = user_money_wallet;