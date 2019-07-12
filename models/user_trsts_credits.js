var mongoose = require('mongoose');
var Schema = mongoose.Schema;

user_trsts_creditsSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    credits:Number,
    status:Number
}),


user_trsts_credits = mongoose.model('user_trsts_credit',user_trsts_creditsSchema);

module.exports = user_trsts_credits;