const { expect } = require("chai");
const { search } = require("../../search/handler");
const { alltransactions } = require("../../alltransactions/handler");
const { balances } = require("../../balances/handler");
const { wallet } = require("../../wallet/handler");

// Test Data Files
describe("Search Api test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
it("test",async ()=>{
  await wallet({queryStringParameters: {query:"0x574E3aA34743C81f8f9e65C38599E4dA95E83ef1"}})
})
});
