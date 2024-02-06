// Test Data Files

const { search } = require("../../search/handler");
const { expect } = require("chai");
describe("Search Api Test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
  it("Get WallAddress should expect the safe wallet address", async () => {
    const queryAddress = "0x116768eA54366Ad7a843c9b14901f45e8acFba9D";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
      },
    });
    result.body = JSON.parse(result.body);
    console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
  it("Get SafeTransactionHash multisign transaction should expect the safe transaction hash", async () => {
    const queryAddress = "0x7a8a08a342b21e6fa37e3ef82597616504ecde1357d56e2f029bdb0621cf5c98";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        // network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
  it("Get SafeTransactionHash moduleId transaction should expect the transaction hash", async () => {
    const queryAddress = "i34be94bc6671b1b2d2d8d5d00f92b607035dd76daba38f650dde0ca5121bc5ea96";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        // network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
  it("Get SafeTransactionHash moduleId transaction from log should expect the transaction hash", async () => {
    const queryAddress = "0x474bc557c4af98e72312537269665aa031fec5d3def8df164883d9b81460a93a";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.exist;
  }).timeout(8000);
  it("Get UserOps should expect the safe transaction hash", async () => {
    const queryAddress = "0xdab4fc47c26a2c0c4519ee5b273fb40a3b9020b5b3db26fa9f16b32018249629";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        // network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);
    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
});
