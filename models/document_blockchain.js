var mongoose = require('mongoose');
var Schema = mongoose.Schema;

document_blockchainSchema = new Schema({
    document_id:String,
    document_location:String,
    document_checksum:String,
    blockchain_added:Number,
    blockchain_ethxid:String,
    blockchain_datatype:String,
    blockchain_datavalue:String,
    blockchain_tx:String,
    blockchain_fees:String,
    status:Number

	
}),


document_blockchain = mongoose.model('document_blockchain',document_blockchainSchema);

module.exports = document_blockchain;