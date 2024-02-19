// Test Data Files
const { balances } = require("../../balances/handler");
const chai = require("chai");
const expect = chai.expect;
describe("Balances Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Get Balance from the balances using query address and network", async () => {
    const response = await balances({
      queryStringParameters: {
        query: "0x279EEa1dA583dCcfb0Fc99bb11A5ffd9EE711F65",
        network: "matic",
      },
    });
    expect(response.statusCode).to.equal(200);
    let responseBody = JSON.parse(response.body);
    expect(responseBody.token[0]).to.have.property("totalQuote").to.be.an("number");
    expect(responseBody.token[0].totalQuote).to.have.gte(0);
    expect(responseBody.token[0]).to.have.property("balance").to.be.an("string");
    expect(parseInt(responseBody.token[0].balance)).to.have.gte(0);
  });

  it("Should handle invalid query addresses", async () => {
    const response = await balances({
      queryStringParameters: {
        query: "0x279EEa1dA583dCcfb0Fc99bb11A5ffd9EE711F6",
        network: "matic",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);

  it("Should handle invalid network", async () => {
    const response = await balances({
      queryStringParameters: {
        query: "0x279EEa1dA583dCcfb0Fc99bb11A5ffd9EE711F65",
        network: "matics",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.have.eq(403);
    expect(responseBody.body.message).to.include("Invalid network");
  }).timeout(2000);
});
