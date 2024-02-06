// 'use strict';
const { middlewareHandler } = require("../middleware");
const { fetchUserOpByAddress } = require("../../layers/jiffyScan/userOp");

module.exports.getuseropbyaddress = middlewareHandler(async (event) => {
  const txHash = event.safe;
  const network = event.network;
  const first = !isNaN(event.first) ? parseInt(event.first) : 100;
  const skip = !isNaN(event.skip) ? parseInt(event.skip) : 0;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoin mmts concurrently
  if (txHash) {
    results = await fetchUserOpByAddress(txHash, network, first, skip);
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
