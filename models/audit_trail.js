var mongoose = require('mongoose');
var Schema = mongoose.Schema;

audit_trailSchema = new Schema({
    document_id:String,
    uid:{type:mongoose.Schema.Types.ObjectId , ref : 'User'},
    action:String,
    date:Date,
    ip:String,
    host:String,
    status:Number
}),


audit_trail = mongoose.model('audit_trail',audit_trailSchema);

module.exports = audit_trail;