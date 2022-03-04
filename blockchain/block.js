const SHA256 = require("crypto-js/sha256");

const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis() {
    const timestamp = "Genesis Time";
    return new this(timestamp, "-----", "abc-xzy", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let hash;
    let timestamp;
    let nonce = 0;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      // console.log({ timestamp });
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastBlock.hash, data, nonce, difficulty);
      console.log(hash.substring(0, difficulty));
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    return lastBlock.timestamp + MINE_RATE > currentTime
      ? difficulty + 1
      : difficulty - 1;
  }
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static hashBlock(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }
}

module.exports = Block;
