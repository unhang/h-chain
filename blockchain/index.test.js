const BlockChain = require("./index");
const Block = require("./block");

describe("Blockchain", () => {
  let bc;

  beforeEach(() => {
    bc = new BlockChain();
  });

  it("start with genesis block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block", () => {
    const data = "foo";
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });
});
