const createKeccakHash = require('keccak')
const secp256k1 = require('secp256k1')
const privateKey = new Buffer('a735ce8b77698733db2d5f289f25ab83d21bacc8c196581e6da1c4aa34d29fe7', 'hex');
let pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
console.log(pubKey);
let address = createKeccakHash('keccak256').update(pubKey).digest().slice(-20).toString('hex');
console.log('0x'+address);
//0xE7a5eb171D9C3B740f04EB76c932F67008b0F751


//1a4ae3dcf39d71dce0956013a2f28c48b3aa761808757137c697b876e2a902b9