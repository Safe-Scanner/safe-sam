// Test Data Files
const { fetchTxFromSafe } = require("../../../layers/safeApi/transactionQueries");
const { expect } = require("chai");
const { getAddress } = require("viem");
describe("safeApi transaction from safe api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get important data such as 'safe' and 'transactionHash' for a module-transaction using valid address and network", async () => {
    const address = getAddress("0xFB9af3DB5E19c4165F413F53fE3bBE6226834548");
    const txHash = "0xd0598d9d8e8996cfae68a1598777340f39ace7f87d2df967ae5b11937d790019";
    const network = "matic";
    const txType = "module";

    const response = await fetchTxFromSafe(address, txHash, network, txType);

    for (const item of response) {
      for (const key in item) {
        expect(key).to.eq(network);
        expect(item[key]).to.have.property("safe").to.be.an.not.eq("");
        expect(item[key]).to.have.property("transactionHash").to.be.an.not.eq("");
        expect(item[key]).to.have.property("moduleTransactionId").to.be.an.not.eq("");
      }
    }
  });

  it("Get important data such as 'safe' and 'transactionHash' for a multisign-transaction using valid address and network", async () => {
    const address = "0x3b93774802E7f70C063afA265f9D55BC12A54EbF";
    const txHash = "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe1a";
    const txType = "multi";
    const network = "matic";
    const response = await fetchTxFromSafe(address, txHash, network, txType);

    for (const item of response) {
      for (const key in item) {
        expect(item[key]).to.have.property("safe").to.be.an.not.eq("");
        expect(item[key]).to.have.property("transactionHash").to.be.an.not.eq("");
        expect(item[key]).to.not.have.property("moduleTransactionId");
      }
    }
  });
});
