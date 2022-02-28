const express = require("express");
const BlockChain = require("../blockchain");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new BlockChain();

app.get("/blocks", (req, res, next) => {
  res.status(200).json(bc.chain);
});

app.listen(HTTP_PORT, () =>
  console.log(`server is running on port ${HTTP_PORT}`)
);
