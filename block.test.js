const Block = require("./Block");

describe("Block", () => {
  beforeEch(() => {
    const data = "bar";
    const lastBlock = Block.genesis();
  });
  it("sets the `data` to match the input", () => {});
  it("sets the `lastHash to match the hash of the last block`", () => {});
});
