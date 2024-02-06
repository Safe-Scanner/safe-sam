// 'use strict';
const { middlewareHandler } = require("../middleware");
const { fetchUserOp } = require("../../layers/jiffyScan/userOp");
const { isTransactionHash } = require("../../common/utils");
const { NETWORK_LIST } = require("../../common/constant");

module.exports.getuserops = middlewareHandler(async (event) => {
  const txHash = event.hash;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];
  if (!NETWORK_LIST[network]?.jiffysan_network) {
    return {
      statusCode: 403,
      body: { message: "Invalid network" },
    };
  }
  // Fetch data for all endpoints concurrently
  if (!isTransactionHash(txHash)) {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }
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
