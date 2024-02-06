// Test Data Files
const { Network } = require("alchemy-sdk");
const { fetchCreation } = require("../../../layers/safeApi/walletQueries");
const chai = require("chai");
const expect = chai.expect;
describe("safeApi creation Api ", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
  it("Get important data such as transactionHash for a creationInfo using valid address and network", async () => {
    const queryAddress = "0x116768eA54366Ad7a843c9b14901f45e8acFba9D";
    const network = "matic";
    const response = await fetchCreation(queryAddress, network);
    for (const item of response) {
      for (const key in item) {
        expect(item[key]).to.have.property("transactionHash").to.be.an.not.eq("");
        expect(item[key]).to.have.property("creator").to.be.an.not.eq("");
      }
    }
  });
});
