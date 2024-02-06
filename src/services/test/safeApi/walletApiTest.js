// Test Data Files
const { fetchWallet } = require("../../../layers/safeApi/walletQueries");
const chai = require("chai");
const expect = chai.expect;
describe("safe api wallet", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get important data such as 'address' and 'transactionHash' for a wallet info using valid address and network", async () => {
    const queryAddress = "0x116768eA54366Ad7a843c9b14901f45e8acFba9D";
    const network = "matic";
    const response = await fetchWallet(queryAddress, network);
    for (const item of response) {
      for (const key in item) {
        expect(item[key]).to.have.property("address").to.be.an("string");
        expect(item[key].owners.length).to.be.gt(0);
        expect(item[key].creationData).to.have.property("transactionHash").to.be.an.not.eq("");
      }
    }
  }).timeout(5000);
});
