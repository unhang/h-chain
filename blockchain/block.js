const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timeStamp, lastHash, hash, data) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timeStamp}
      Last Hash: ${this.lastHash}
      Hash     : ${this.hash}
      data     : ${this.data}`;
  }

  static genesis() {
    const timeStamp = "Genesis Time";
    return new this(timeStamp, "-----", "abc-xzy", []);
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastBlock.hash, data);
    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  static hashBlock(block) {
    const { timeStamp, lastHash, data } = block;
    return Block.hash(timeStamp, lastHash, data);
  }
}

module.exports = Block;
