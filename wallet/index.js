const ChainUtil = require("../chain-util");
const { INITIAL_BALANCE } = require("../config");
const Transaction = require("./transaction");
const TransactionPool = require("./transaction-pool");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];

    blockchain.chain.forEach((block) =>
      block.data.forEach((transaction) => transactions.push(transaction))
    );

    console.log({ transactions });

    const walletInputTs = transactions.filter(
      (transaction) => transaction.input.address === this.publicKey
    );

    let startTime = 0;
    console.log({ walletInputTs });
    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce((prev, curr) =>
        prev.input.timestamp > curr.input.timestamp ? prev : curr
      );

      // now balance
      console.log({ balance });
      balance = recentInputT.outputs.find(
        (output) => output.address === this.publicKey
      ).amount;

      console.log({ balance });

      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach((transaction) => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find((output) => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  toString() {
    return `Wallet
    publicKey  : ${this.publicKey}
    balance    : ${this.balance}
    `;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, transactionPool, blockchain) {
    this.balance = this.calculateBalance(blockchain);
    console.log("-------------------");
    console.log(this.balance);
    console.log("-------------------");
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransactions(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }
    return transaction;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet";
    return blockchainWallet;
  }
}

module.exports = Wallet;
