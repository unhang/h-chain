const express = require("express");
const bodyParser = require("body-parser");
const BlockChain = require("../blockchain");
const P2PServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");
const Miner = require("./miner");
const { json, redirect } = require("express/lib/response");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

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

app.get("/mine-transaction", (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect("/blocks");
});

app.get("/public-key", (req, res) => res.json(wallet.publicKey));

app.post("/transaction", (req, res) => {
  const { recipient, amount } = req.body;
  let transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect("/transactions");
});

app.listen(HTTP_PORT, () =>
  console.log(`server is running on port ${HTTP_PORT}`)
);

p2pServer.listen();
