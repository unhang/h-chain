const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(
      (t) => t.id === transaction.id
    );

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] =
        transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransactions(address) {
    return this.transactions.find((t) => t.input.address === address);
  }

  validTransaction() {
    return this.transactions.filter((transaction) => {
      const totalAmount = transaction.outputs.reduce(
        (total, output) => total + output.amount,
        0
      );

      if (transaction.input.amount !== totalAmount) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }
      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
