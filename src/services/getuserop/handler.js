// 'use strict';
const { middlewareHandler } = require("../middleware");
const { fetchUserOp } = require("../../layers/jiffyScan/userOp");

module.exports.getuserops = middlewareHandler(async (event) => {
  const txHash = event.hash;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  results = await fetchUserOp(txHash, network);

  if (results.length <= 0) {
    return {
      statusCode: 200,
      body: { message: "No record found" },
    };
  }
  // Return the result array
  return results[0];
});
