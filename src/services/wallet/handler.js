// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress } = require("../../common/utils");
const { fetchWallet } = require("../../layers/safeApi/queries");

module.exports.wallet = middlewareHandler(async (event) => {
  const queryAddress = event.query;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
      results = await fetchWallet(queryAddress);
   
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    }
  }

if(results.length <= 0){
  return {
    statusCode: 200,
    body: { message: "No record found" },
  }
}
  // Return the result array
  return results[0];
});


