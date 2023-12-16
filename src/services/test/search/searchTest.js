const { expect } = require("chai");
const { search } = require("../../search/handler");
const { alltransactions } = require("../../alltransactions/handler");

// Test Data Files
describe("Search Api test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
it("test",async ()=>{
  await alltransactions({queryStringParameters: {query:"0x4855b6c0f7d02709F812bA33A2083FF57178B790"}})
})
});
