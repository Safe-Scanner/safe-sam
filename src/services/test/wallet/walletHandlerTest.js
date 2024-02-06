// Test Data Files
const { wallet } = require("../../wallet/handler");
const chai = require("chai");
const { getAddress } = require("viem");
const expect = chai.expect;
describe("wallet Api ", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get important data such as 'address' and 'owners' for a walletInfo using valid address  ", async () => {
    const query = "0x279eea1da583dccfb0fc99bb11a5ffd9ee711f65";
    const response = await wallet({
      queryStringParameters: {
        query,
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect(responseBody[key].address).to.eq(getAddress(query));
      expect(responseBody[key]).to.have.property("owners").to.be.an("array");
      expect(responseBody[key].owners.length).to.be.gt(0);
      expect(responseBody[key]).to.have.property("creationData").to.be.an("object");
    }
  }).timeout(5000);

  it("should handle invalid query addresses", async () => {
    const response = await wallet({
      queryStringParameters: {
        query: "0x279EEa1dA583dCcfb0Fc99bb11A5ffd9EE711F6",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);
});
