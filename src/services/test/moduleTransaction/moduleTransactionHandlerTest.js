// Test Data Files

const { moduletransaction } = require("../../moduletransaction/handler");
const { expect } = require("chai");

describe("moduleTransaction Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Should have safe, transaction hash using module-transaction with valid query address", async () => {
    const query = "i4c02301c684526cda73a9479f87da01648c3e7d87ccd6d0a1bbc072c8067d4f425";
    const response = await moduletransaction({
      queryStringParameters: {
        query: query,
        // network: "matic",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an("string");
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("safe").to.be.an("string");
      expect(responseBody[key]).to.have.property("safe").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("moduleTransactionId").to.be.an.eq(query);
    }
  });

  it("GET important data like safe,transaction hash using module-transaction with valid query address with network", async () => {
    const query = "i34be94bc6671b1b2d2d8d5d00f92b607035dd76daba38f650dde0ca5121bc5ea96";
    const response = await moduletransaction({
      queryStringParameters: {
        query: query,
        network: "matic",
      },
    });

    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an("string");
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("safe").to.be.an("string");
      expect(responseBody[key]).to.have.property("moduleTransactionId").to.be.an.eq(query);
    }
  });

  it("should handle invalid query address", async () => {
    const response = await moduletransaction({
      queryStringParameters: {
        query: "i34be94bc6671b1b2d2d8d5d00f92b607035dd76daba38f650dde0ca5121bc5ea",
        network: "matic",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  });
});
