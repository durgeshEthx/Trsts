var mongoose = require('mongoose');
var Schema = mongoose.Schema;

contactUsSchema = new Schema({
	//unique_id:Number,
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    // email:{type:String},
    company:String,
    jobTitle:String,
    employees:Number,
    phone:Number,
    skype:String,
    date:{ type: Date, default: Date.now() },
    ip:String,
    status:Number
}),


contactus = mongoose.model('contact',contactUsSchema);

module.exports = contactus;