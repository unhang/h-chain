const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);
    return block;
  }

  isValidChain(chain) {
    // check the first block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    // check if block is valid
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.hashBlock(block)
      ) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length < this.chain.length) {
      console.log("Received chain length is not long enough");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("The received chain is not valid");
      return;
    }
    console.log("Replacing blockchain with new chain");
    this.chain = newChain;
  }
}

module.exports = BlockChain;
