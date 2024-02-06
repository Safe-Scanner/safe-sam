// Test Data Files
const { fetchAlchemyTransactionHash } = require("../../../layers/alchemy/queries");
const chai = require("chai");
const expect = chai.expect;
describe("alchemy Api", function () {
  // before(async function () {
  this.timeout(50000);
  // });

  // after(async function () {
  //   this.timeout(50000);
  // });

  it("Get safe and type from the alchemy with valid query ", async () => {
    const hash = "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe1a";
    const network = "matic";
    const response = await fetchAlchemyTransactionHash(hash, network);
    expect(response).to.have.property("safe");
    expect(response.safe).to.have.eq("0x3b93774802E7f70C063afA265f9D55BC12A54EbF");
    expect(response).to.have.property("type");
    expect(response.type).to.have.eq("multi");
  });

  it("should handle invalid network", async () => {
    const hash = "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe1a";
    const network = "matics";
    const response = await fetchAlchemyTransactionHash(hash, network);
    expect(response.safe).to.be.eq('');
    expect(response.type).to.be.eq('');
  }).timeout(2000);

  it("should handle invalid query address", async () => {
    const hash = "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe";
    const network = "matic";
    const response = await fetchAlchemyTransactionHash(hash, network);
    expect(response.safe).to.be.eq('');
    expect(response.type).to.be.eq('');
  }).timeout(2000);
});
