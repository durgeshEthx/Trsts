var mongoose = require('mongoose');
var Schema = mongoose.Schema;

discountSchema = new Schema({

    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: String,
    quantum: String,
    quantum_type: String,
    validity: String,
    new_only_restriction: Number,
    cc_required: Number,
    plan_restriction: String,
    billing_restriction: String,


    status: Number
}),


    discount = mongoose.model('discount', discountSchema);

module.exports = discount;