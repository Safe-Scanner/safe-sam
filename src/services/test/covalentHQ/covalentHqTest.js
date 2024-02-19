// Test Data Files
const { fetchERC20BalancesFromCovalent } = require("../../../layers/covalentHQ/queries");
const chai = require("chai");
const expect = chai.expect;
describe("covalentHQ Api test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get address from the covalentHQ details with valid query", async () => {
    const address = "0x116768eA54366Ad7a843c9b14901f45e8acFba9D";
    const network = "matic";
    const response = await fetchERC20BalancesFromCovalent(address, network);

    expect(response.token.data).to.have.property("address").to.be.an("string");
    let responseData = response.token.data.items;
    responseData.map((result) => {
      expect(result).to.have.property("contract_address").to.be.an("string");
      expect(result).to.have.property("balance").to.be.an("string");
    });
  });

  it("should handle invalid query addresses", async () => {
    const address = "0x116768eA54366Ad7a843c9b14901f45e8acFba9";
    const network = "matic";
    const response = await fetchERC20BalancesFromCovalent(address, network);

    expect(response.statusCode).to.equal(400);
    expect(response.error_message).to.include("Malformed address provided");
  }).timeout(2000);

  it("should handle invalid network ", async () => {
    const address = "0x116768eA54366Ad7a843c9b14901f45e8acFba9D";
    const network = "matics";
    const response = await fetchERC20BalancesFromCovalent(address, network);

    expect(response.statusCode).to.equal(501);
    expect(response.error_message).to.include("Chain undefined not supported.");
  }).timeout(2000);
});
