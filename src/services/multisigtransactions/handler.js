// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isTransactionHash } = require("../../common/utils");
const { fetchTransactionHash } = require("../../layers/safeApi/queries");

module.exports.multisigtransactions = middlewareHandler(async (event) => {
  const safetxhash = event.query;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isTransactionHash(safetxhash)) {
    results = await fetchTransactionHash(safetxhash);
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
