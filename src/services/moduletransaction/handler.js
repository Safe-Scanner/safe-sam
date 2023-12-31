// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isModuleTransaction } = require("../../common/utils");
const { fetchModuleTransaction } = require("../../layers/safeApi/transactionQueries");

module.exports.moduletransaction = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isModuleTransaction(queryAddress)) {
    results = await fetchModuleTransaction(queryAddress, network);
    if (results.length <= 0) {
      if (network) {
        results = await fetchModuleTransaction(queryAddress, null);
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
