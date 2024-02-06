// Test Data Files
const { transaction } = require("../../transaction/handler");
const { expect } = require("chai");

describe("transaction Api", function () {
  // before(async function () {
  this.timeout(50000);
  // });

  // after(async function () {
  //   this.timeout(50000);
  // });

  it("Get important data such as 'safe' and 'transactionHash' for a transactionInfo using valid address and network", async () => {
    const hash='0xd0598d9d8e8996cfae68a1598777340f39ace7f87d2df967ae5b11937d790019'
    const response = await transaction({
      queryStringParameters: {
        hash,
        network: "matic",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).to.have.property("type").to.be.an("string");
    expect(responseBody).to.have.property("network").to.be.an("string");
    expect(responseBody).to.have.property("transactionInfo").to.be.an("object");
    expect(responseBody.transactionInfo.transactionHash).to.be.eq(hash)
  });
  it("Should have the module transaction id while passing the module transaction id", async () => {
    const hash='i4c02301c684526cda73a9479f87da01648c3e7d87ccd6d0a1bbc072c8067d4f425'
    const response = await transaction({
      queryStringParameters: {
        hash,
        network: "matic",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).to.have.property("type").to.be.an("string");
    expect(responseBody).to.have.property("network").to.be.an("string");
    expect(responseBody).to.have.property("transactionInfo").to.be.an("object");
    expect(responseBody.transactionInfo.moduleTransactionId).to.be.eq(hash)
  });

  it("should handle invalid query addresses", async () => {
    const response = await transaction({
      queryStringParameters: {
        hash: "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe",
        network: "matic",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  });

  it("should handle invalid network", async () => {
    const response = await transaction({
      queryStringParameters: {
        hash: "0xeb8869d3deb96f9a42ff95ea98847eca6800223ef4ef98f3e9a0b12f6e6bfe1a",
        network: "matics",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(200);
    expect(responseBody.body.message).to.include("No record found");
  });
});
