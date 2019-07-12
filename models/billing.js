var mongoose = require('mongoose');
var Schema = mongoose.Schema;

billingSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    plan:String,
    start_date:{ type: Date, default: Date.now() },
    end_date:Date,
    plan_type:String,
    status:Number
}),


billing = mongoose.model('billing',billingSchema);

module.exports = billing;