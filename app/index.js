const express = require("express");
const bodyParser = require("body-parser");
const BlockChain = require("../blockchain");
const P2PServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");
const Transaction = require("../wallet/transaction");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);

app.use(bodyParser.json());

app.get("/blocks", (req, res, next) => {
  res.status(200).json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New Block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => res.json(tp.transactions));

app.post("/transaction", (req, res) => {
  const { recipient, amount } = req.body;
  let transaction = wallet.createTransaction(recipient, amount, tp);
  console.log(transaction);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

app.listen(HTTP_PORT, () =>
  console.log(`server is running on port ${HTTP_PORT}`)
);

p2pServer.listen();
