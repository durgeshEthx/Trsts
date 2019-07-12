var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//logininf0 schema
userSchema = new Schema( {
	
	uid: Number,
	email: String,
    fullname: String,
	password: String,
	passwordConf: String,
	email_code:{type:String},
	email_verified:Number,
	Date: { type: Date, default: Date.now() },
	ip:String,
	status:Number,
	pwd_reset_code:String
	
}),


User = mongoose.model('logininfo', userSchema);

module.exports = User;
