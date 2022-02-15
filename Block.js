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

  static genesisBlock() {
    return new this("Genesis time", "-----", "f1r57 h47h", []);
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = "todo";
    return new this(timestamp, lastHash, hash, data);
  }
}

module.exports = Block;
