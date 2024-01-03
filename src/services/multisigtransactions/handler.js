// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isTransactionHash } = require("../../common/utils");
const { fetchMultiSignatureTransaction } = require("../../layers/safeApi/transactionQueries");

module.exports.multisigtransactions = middlewareHandler(async (event) => {
  const network = event.network;
  const queryAddress = event.query;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isTransactionHash(queryAddress)) {
    results = await fetchMultiSignatureTransaction(queryAddress, network);
    if (results <= 0) {
      if (network) {
        results = await fetchMultiSignatureTransaction(queryAddress, null);
      }
    }
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }

  if (results.length <= 0) {
    return {
      statusCode: 200,
      body: { message: "No record found" },
    };
  }
  // Return the result array
  return results[0];
});
