// Test Data Files

const { multisigtransactions } = require("../../multisigtransactions/handler");
const { expect } = require("chai");

describe("Multi sign transaction Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("Should have safe, transaction hash using multisign-transaction with valid query address", async () => {
    // safe transaction hash
    const query = "0xc89a7df866aa282e70e75403f5bca9f4c4bc449c3b81243dc1eeb2b2e1b834a3";
    const response = await multisigtransactions({
      queryStringParameters: {
        query,
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect(responseBody[key]).to.have.property("safe").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("safeTxHash").to.be.an("string");
      expect(responseBody[key]).to.have.property("safeTxHash").to.be.an.eq(query);
      expect(responseBody[key]).to.have.property("confirmations").to.be.an("array");
      for (const confirmation of responseBody[key].confirmations) {
        expect(confirmation).to.have.property("owner").to.be.an.not.eq("");
      }
    }
  }).timeout(8000);

  it("Should have safe, transaction hash using multisign-transaction with valid query address and network", async () => {
    const query = "0xc89a7df866aa282e70e75403f5bca9f4c4bc449c3b81243dc1eeb2b2e1b834a3";
    const network = "matic";
    const response = await multisigtransactions({
      queryStringParameters: {
        query,
        network,
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect(key).to.have.eq(network);
      expect(responseBody[key]).to.have.property("safe").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("transactionHash").to.be.an.not.eq("");
      expect(responseBody[key]).to.have.property("safeTxHash").to.be.an("string");
      expect(responseBody[key]).to.have.property("safeTxHash").to.be.an.eq(query);
      expect(responseBody[key]).to.have.property("confirmations").to.be.an("array");
      for (const confirmation of responseBody[key].confirmations) {
        expect(confirmation).to.have.property("owner").to.be.an.not.eq("");
      }
    }
  }).timeout(6000);

  it("should handle invalid query address", async () => {
    const hash = "0xc89a7df866aa282e70e75403f5bca9f4c4bc449c3b81243dc1eeb2b2e1b834";
    const network = "matic";
    const response = await multisigtransactions(hash, network);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);

  it("should handle invalid network", async () => {
    const hash = "0xc89a7df866aa282e70e75403f5bca9f4c4bc449c3b81243dc1eeb2b2e1b834a3";
    const network = "matics";
    const response = await multisigtransactions(hash, network);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);
});
