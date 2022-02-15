const Block = require("./Block");

const block = new Block("foo", "bar", "zoo", "baz");
console.log(block.toString());
console.log(Block.genesisBlock().toString());
