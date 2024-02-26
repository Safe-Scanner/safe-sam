// Test Data Files
const { expect } = require("chai");
const { getuseropbyaddress } = require("../../getuserop/useropsbyaddresshandler");
describe("Get userOps by address Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  it("GET UserOp hash using address hash", async () => {
    const query = "0xfdd3c9ccb3173e5877c1658e170dc99a13bbe5ef";
    const response = await getuseropbyaddress({
      queryStringParameters: {
        safe: query,
        network:'eth'
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
        expect( responseBody[key].accountDetail).to.have.property("userOpHash");
        expect( responseBody[key].accountDetail).to.have.property("transactionHash").to.be.an.not.eq("");
        for(const userOp of responseBody[key].accountDetail.userOps) {
          expect(userOp).to.have.property("dataDecoded");
        }
    }
  }).timeout(50000);

  it("GET UserOp hash using address without network", async () => {
    const response = await getuseropbyaddress({
      queryStringParameters: {
        safe: "0xfdd3c9ccb3173e5877c1658e170dc99a13bbe5ef",
      },
    });
    expect(response.statusCode).to.equal(200);
    const responseBody = JSON.parse(response.body);
    for (const key in responseBody) {
      expect( responseBody[key].accountDetail).to.have.property("userOpHash");
      expect( responseBody[key].accountDetail).to.have.property("transactionHash").to.be.an.not.eq("");
      for(const userOp of responseBody[key].accountDetail.userOps) {
        expect(userOp).to.have.property("dataDecoded");
      }
    }
  }).timeout(5000);

  it("should handle invalid query addresses", async () => {
    const response = await getuseropbyaddress({
      queryStringParameters: {
        hash: "0xfdd3c9ccb3173e5877c1658e170dc99a13bbe5efs",
        network: "eth",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.equal(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);

  it("should handle invalid network", async () => {
    const response = await getuseropbyaddress({
      queryStringParameters: {
        hash: "0x4f982d788b8c74fec9f0501dba1df0de31d4a3a79c081da70adbcd5c485526ac",
        network: "eths",
      },
    });
    const responseBody = JSON.parse(response.body);
    expect(responseBody.statusCode).to.be.eq(403);
    expect(responseBody.body.message).to.include("Invalid request");
  }).timeout(2000);
});
