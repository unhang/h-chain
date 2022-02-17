const Block = require("./Block");

// const block = new Block("foo", "bar", "zoo", "baz");
// console.log(block.toString());
// console.log(Block.genesisBlock().toString());

const genesisBlock = Block.genesisBlock();

console.log(genesisBlock.toString());

const fooBlock = Block.mineBlock(Block.genesisBlock(), "foo");

console.log(fooBlock.toString());
