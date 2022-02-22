const Block = require("./Block");

// const block = new Block("foo", "bar", "zoo", "baz");
// console.log(block.toString());
// console.log(Block.genesisBlock().toString());

const genesisBlock = Block.genesis();

console.log(genesisBlock.toString());

const fooBlock = Block.mineBlock(Block.genesis(), "foo");

console.log(fooBlock.toString());
