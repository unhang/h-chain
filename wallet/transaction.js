const ChainUtil = require("../chain-util");
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    //   input": {
    //     "timestamp": 1647616265310,
    //     "amount": 500,
    //     "address": "04aa482b538179f90dd152a258fe70bcd6917bf3cd920ba9f2053c24596f23059f32353820609f7b911a7efdb58b799c39ac14419890be1277fddd63bfaa184661",
    //     "signature": {
    //         "r": "9f5034c3593f6f4b74e10e398f2a565f8cabe0da200d55ed64529a683801a2ab",
    //         "s": "eea13866bf88dd9b2867f1864f03955b72cefd777b3ef7ca515f9aac030d3dbe",
    //         "recoveryParam": 0
    //     }
    // },
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
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

    this.outputs.push({ amount, address: recipient });
    // because we updated the transaction, so the input with signature is no longer valid
    // should create new signature
    Transaction.signTransaction(this, senderWallet);
    return this;
  }

  // helper function in order to define the `outputs` of transaction
  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      { amount: MINING_REWARD, address: minerWallet.publicKey }
    ]);
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (senderWallet.balance < amount) {
      console.log(`Amount: ${amount} exceeds balance;`);
      return;
    }
    return Transaction.transactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      { amount, address: recipient }
    ]);
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
