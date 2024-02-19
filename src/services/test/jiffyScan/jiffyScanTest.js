// Test Data Files
const { fetchUserOp } = require("../../../layers/jiffyScan/userOp");
const { expect } = require("chai");
describe("JiffyScan Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("GET UserOp hash using Query address", async () => {
    const queryAddress = "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526ac";
    const response = await fetchUserOp(queryAddress);
    Object.keys(response[0]).map((key) => {
      response[0][key].map((result) => {
        expect(result).to.have.property("userOpHash").to.be.an("string");
        expect(result).to.have.property("transactionHash").to.be.an("string");
      });
    });
  }).timeout(3000);

  it("GET UserOp hash using Query address with network", async () => {
    const queryAddress = "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526ac";
    const network = "eth";
    const response = await fetchUserOp(queryAddress, network);
    Object.keys(response[0] || []).map((key) => {
      response[0][key].map((result) => {
        expect(result).to.have.property("userOpHash").to.be.an("string");
        expect(result).to.have.property("userOpHash").to.be.eq(queryAddress);
        expect(result).to.have.property("transactionHash").to.be.an("string");
        expect(result).to.have.property("transactionHash").to.be.not.eq("");
      });
    });
  }).timeout(5000);

  it("should handle invalid query addresses", async () => {
    const queryAddress = "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526";
    const network = "eth";
    const response = await fetchUserOp(queryAddress, network);
    expect(response).to.be.an("array").that.is.empty;
  });
});
