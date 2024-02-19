// Test Data Files
const { alltransactions } = require("../../alltransactions/handler");
const { expect } = require("chai");
describe("alltransaction Api test", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });
  it("list: should list the transaction with pagination and without network", async function () {
    let offset = 1;
    let limit = 1;
    let data = null;
    let page_size = 0;
    for (offset = 0; !data || data.next; offset++) {
      const response = await alltransactions({
        queryStringParameters: {
          query: "0x116768eA54366Ad7a843c9b14901f45e8acFba9D",
          limit: limit,
          offset: offset,
        },
      });
      expect(response.statusCode).to.equal(200);

      response.body = JSON.parse(response.body);
      data = response.body[Object.keys(response.body)[0]];
      console.log("result========",data.results)
      page_size += data?.results?.length;

      if (!data.next) {
        expect(page_size).to.equal(data.count);
        break;
      } else {
        expect(page_size).to.be.lessThanOrEqual(data.count);
      }
    }
    expect(page_size).to.be.equal(data.count);
  }).timeout(50000);
  it("list: should list the transaction with pagination and with network", async function () {
    let offset = 1;
    let limit = 1;
    let data = null;
    let page_size = 0;
    for (offset = 0; !data || data.next; offset++) {
      const response = await alltransactions({
        queryStringParameters: {
          query: "0x116768eA54366Ad7a843c9b14901f45e8acFba9D",
          limit: limit,
          offset: offset,
          network: "matic",
        },
      });
      expect(response.statusCode).to.equal(200);
      response.body = JSON.parse(response.body);
      data = response.body[Object.keys(response.body)[0]];
      page_size += data.results.length;

      if (!data.next) {
        expect(page_size).to.equal(data.count);
        break;
      } else {
        expect(page_size).to.be.lessThanOrEqual(data.count);
      }
    }
    expect(page_size).to.be.equal(data.count);
  }).timeout(50000);
});
