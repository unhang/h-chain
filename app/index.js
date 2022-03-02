const express = require("express");
const bodyParser = require("body-parser");
const BlockChain = require("../blockchain");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();

app.use(bodyParser.json());

app.get("/blocks", (req, res, next) => {
  res.status(200).json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New Block added: ${block.toString()}`);
  // res.status(201).json(block);
  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () =>
  console.log(`server is running on port ${HTTP_PORT}`)
);
