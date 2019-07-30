var mongoose = require('mongoose');
var Schema = mongoose.Schema;

placeholderSchema = new Schema({
	
	uid : {type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    doc_id:{type:mongoose.Schema.Types.ObjectId , ref : 'documents'},
    count:Number,
    top:String,
    left:String,
    name:String


}),


placeholder = mongoose.model('placeholder',placeholderSchema);

module.exports = placeholder;