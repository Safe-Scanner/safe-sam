const { expect } = require("chai");
const { search } = require("../../search/handler");
const { alltransactions } = require("../../alltransactions/handler");
const { balances } = require("../../balances/handler");

// Test Data Files
describe("Search Api test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
it("test",async ()=>{
  await balances({queryStringParameters: {query:"0x279EEa1dA583dCcfb0Fc99bb11A5ffd9EE711F65",network:'mainnet'}})
})
});
