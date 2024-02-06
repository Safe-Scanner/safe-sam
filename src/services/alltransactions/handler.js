// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress } = require("../../common/utils");
const { fetchAllTransactions } = require("../../layers/safeApi/transactionQueries");

module.exports.alltransactions = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;
  const { ordering, offset, executed, queued, trusted, limit } = event;
  // Initialize an array to store the results
  let results = [];
  const pageSize = limit > 0 ? limit : 25;
  const page = offset ? offset : 0;
  const orderList = ordering ? ordering : null;
  const isExecuted = !!executed;
  const isTrusted = !!trusted;
  const isQueued = !!queued;

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
    results = await fetchAllTransactions(queryAddress, network, {
      ordering: orderList,
      limit: pageSize,
      offset: page,
      executed: isExecuted,
      queued: isTrusted,
      trusted: isQueued,
    });
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }
  if (!results[0][network]) {
    if (network) {
      results = await fetchAllTransactions(queryAddress, null, {
        ordering: orderList,
        limit: pageSize,
        offset: page,
        executed: isExecuted,
        queued: isTrusted,
        trusted: isQueued,
      });
    }
  }
  const filteredResults = results.filter((network) => network[Object.keys(network)].count > 0);

  if (filteredResults.length <= 0) {
    return {
      statusCode: 200,
      body: {
        message: `No record found or count is 0 for ${network ? network : "All"} networks`,
      },
    };
  }

  // Return the result array with counts greater than 0
  return filteredResults[0];
});
