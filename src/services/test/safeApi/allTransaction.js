// Test Data Files
const { fetchAllTransactions } = require("../../../layers/safeApi/transactionQueries");
const { expect } = require("chai");
const { alltransactions } = require("../../alltransactions/handler");
describe("SafeApi AllTransaction Api", function () {
  before(async function () {
    this.timeout(50000);
  });

  after(async function () {
    this.timeout(50000);
  });

  it("list: should list the fetch transaction with pagination and without network", async function () {
    let offset = 1;
    let limit = 1;
    let data = null;
    let page_size = 0;
    for (offset = 0; !data || data.next; offset++) {
      const response = await fetchAllTransactions(
        "0x116768eA54366Ad7a843c9b14901f45e8acFba9D",
        "",
        {
          limit: limit,
          offset: offset,
        }
      );

      const key = Object.keys(response[0])[0];
      data = response[0][key];
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
  it("list: should list the fetch transaction with pagination, network", async function () {
    let offset = 1;
    let limit = 1;
    let data = null;
    let page_size = 0;
    for (offset = 0; !data || data.next; offset++) {
      const response = await fetchAllTransactions(
        "0x116768eA54366Ad7a843c9b14901f45e8acFba9D",
        "matic",
        {
          limit: limit,
          offset: offset,
        }
      );

      const key = Object.keys(response[0])[0];
      data = response[0][key];
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
