// Test Data Files
const { fetchMultiSignatureTransaction } = require("../../../layers/safeApi/transactionQueries");
const { expect } = require("chai");
describe("safeApi multiSign transaction Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get important data such as 'safe' and 'transactionHash' for a multisign-transaction using valid address and network", async () => {
    const queryAddress = "0x0af4f60a2cab25e05647467ca221384fbdafb1bfecefcbc4a76f49af299102a1";
    const network = "eth";
    const response = await fetchMultiSignatureTransaction(queryAddress, network);

    for (const item of response) {
      for (const key in item) {
        expect(item[key]).to.have.property("safe").to.be.an.not.eq("");
        expect(item[key]).to.have.property("transactionHash").to.be.an.not.eq("");
        expect(item[key]).to.have.property("safeTxHash").to.be.an.eq(queryAddress);
        expect(item[key]).to.have.property("confirmations").to.be.an("array");

        let confirmation = item[key].confirmations;
        confirmation.map((result) => {
          expect(result).to.have.property("owner").to.be.an.not.eq("");
        });
      }
    }
  }).timeout(5000);
});
