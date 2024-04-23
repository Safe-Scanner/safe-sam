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
    // console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
  it("Get SafeTransactionHash multisign transaction should expect the safe transaction hash", async () => {
    const queryAddress = "0xcae58a8d6acb23a621e23aab97806b32f131dc13eee0216b53230388a8ba9b38";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        // network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    // console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);

    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
  it("Get SafeTransactionHash moduleId transaction should expect the transaction hash", async () => {
    const queryAddress = "0xb76068b3423a8534fdf36fbbd4b3b83f973b90045a221b01b2df14f1a6abf7b7";
    const result = await search({
      queryStringParameters: {
        query: queryAddress,
        // network:"matic"
      },
    });
    result.body = JSON.parse(result.body);
    // console.log(result);
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
    // console.log(result);
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
    // console.log(result);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an("object");
    expect(Object.keys(result)).to.have.length.at.least(1);
    expect(Object.keys(result.body)).to.have.length.at.least(1);
    const network = Object.keys(result.body)[0];
    expect(result.body[network]).to.be.an("array").with.length.at.least(1);
    expect(result.body[network][0]).to.deep.equal(queryAddress);
  }).timeout(8000);
});
