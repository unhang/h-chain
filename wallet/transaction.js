const ChainUtil = require("../chain-util");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.transaction.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (!senderOutput) {
      console.log("Sender Wallet not found");
      return;
    }
    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance;`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;

    transaction.outputs.push({ amount, address: recipient });
    // because we updated the transaction, so the input with signature is no longer valid
    // should create new signature
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  static newTransaction(senderWallet, recipient, amount) {
    transaction = new this();

    if (senderWallet.balance < amount) {
      console.log(`Amount: ${amount} exceeds balance;`);
      return;
    }
    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        { amount, address: recipient }
      ]
    );
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifyTransaction(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
