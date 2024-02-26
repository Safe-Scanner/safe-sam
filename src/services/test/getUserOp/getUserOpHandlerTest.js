// Test Data Files
const { getuserops } = require("../../getuserop/handler");
const { expect } = require("chai");
describe("Get userOps Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  it("GET UserOp hash using transaction hash", async () => {
    const query = "0x6f2e9531e81f6557028af9f3df51f10471445a8f2cebae37b928d19fe9aac805";
    const response = await getuserops({
      queryStringParameters: {
        hash: query,
        network:'matic'
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      for (const responseData of responseBody[key]) {
        expect(responseData).to.have.property("userOpHash").to.be.eq(query);
        expect(responseData).to.have.property("transactionHash").to.be.an.not.eq("");
      }
    }
  }).timeout(50000);

  it("GET UserOp hash using Query address with network", async () => {
    const response = await getuserops({
      queryStringParameters: {
        hash: "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526ac",
        network: "eth",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      for (const responseData of responseBody[key]) {
        expect(responseData).to.have.deep.property("userOpHash").to.be.an("string");
        expect(responseData).to.have.property("transactionHash").to.be.an("string");
      }
    }
  }).timeout(2000);

  it("should handle invalid query addresses", async () => {
    const response = await getuserops({
      queryStringParameters: {
        hash: "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526",
        network: "eth",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);

  it("should handle invalid network", async () => {
    const response = await getuserops({
      queryStringParameters: {
        hash: "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526ac",
        network: "eths",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.be.eq(403);
    expect(responseBody.body.message).to.include("Invalid network");
  }).timeout(2000);
});
