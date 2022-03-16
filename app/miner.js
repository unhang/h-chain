class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner
    // create a block consists the valid transactions
    // synchronize the chains to p2p server
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pool
  }
}

module.exports = Miner;
