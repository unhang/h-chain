const EC = require("elliptic").ec;
const uuidV1 = require("uuid").v1;
const SHA256 = require("crypto-js/sha256");

const ec = new EC("secp256k1");

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static id() {
    return uuidV1();
  }

  static verifyTransaction(publicKey, signature, hashData) {
    return ec.keyFromPublic(publicKey, "hex").verify(hashData, signature);
  }
}

module.exports = ChainUtil;
