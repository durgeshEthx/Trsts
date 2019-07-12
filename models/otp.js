var mongoose = require('mongoose');
var Schema = mongoose.Schema;

otpSchema = new Schema({

    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: Number,
    date: Date,
    ip: String,
    status: Number
}),


    otp = mongoose.model('otp', otpSchema);

module.exports = otp;