// Test Data Files
const { fetchModuleTransaction } = require("../../../layers/safeApi/transactionQueries");
const chai = require("chai");
const expect = chai.expect;
describe("safeApi module transaction Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get important data such as 'safe' and 'transactionHash' for a module-transaction using valid address and network", async () => {
    const queryAddress = "i34be94bc6671b1b2d2d8d5d00f92b607035dd76daba38f650dde0ca5121bc5ea96";
    const network = "matic";
    const response = await fetchModuleTransaction(queryAddress, network);

    for (const item of response) {
      for (const key in item) {
        expect(key).to.have.eq(network);
        expect(item[key]).to.have.property("transactionHash").to.be.an.not.eq("");
        expect(item[key]).to.have.property("safe").to.be.an.not.eq("");
        expect(item[key]).to.have.property("moduleTransactionId").to.be.an.eq(queryAddress);
      }
    }
  });
});
