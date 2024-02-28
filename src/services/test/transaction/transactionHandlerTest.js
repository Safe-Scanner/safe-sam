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
  it("Get should have the sponsored and sponsoredBy with given user Op", async () => {
    const hash = "0xb880799193a28259d609b004aaf9c6394b460e7a2524a5c63e546a0479ed4d12";
    const response = await transaction({
      queryStringParameters: {
        hash,
        network: "matic",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).to.have.property("transactionInfo").to.be.an("object");
    expect(responseBody.transactionInfo).to.been.property("sponsoredBy").exist;

  });
  it("Get should have data decoded and sponsoredBy with given user Op", async () => {
    const hash = "0x940d99b7c84c2759808249e24d4f00197365854d8fe9ee86e7a32be334d6bf82";
    const response = await transaction({
      queryStringParameters: {
        hash,
        network: "eth",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).to.have.property("transactionInfo").to.be.an("object");
    expect(responseBody).to.have.property("type");
    expect(responseBody.transactionInfo).to.have.property("sponsoredBy").exist;
    expect(responseBody.transactionInfo).to.have.property("dataDecoded");

  });
  it("Get important data such as 'safe' and 'transactionHash' for a transactionInfo using valid address and network", async () => {
    const hash='0xa77971438e2b59b8054d392eb9c2f3f018723bcac078553692a2a41fdd2106b0'
    const response = await transaction({
      queryStringParameters: {
        hash,
        network: "sep",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).to.have.property("type").to.be.an("string");
    expect(responseBody).to.have.property("network").to.be.an("string");
    expect(responseBody).to.have.property("transactionInfo").to.be.an("object");
    expect(
      responseBody.transactionInfo.transactionHash || responseBody.transactionInfo.safeTxHash
    ).to.be.eq(hash);
  });
  it("Should have the module transaction id while passing the module transaction id", async () => {
    const hash = "i4c02301c684526cda73a9479f87da01648c3e7d87ccd6d0a1bbc072c8067d4f425";
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
    expect(responseBody.transactionInfo.moduleTransactionId).to.be.eq(hash);
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
