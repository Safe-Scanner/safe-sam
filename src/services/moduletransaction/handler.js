// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isTransactionHash,isWalletAddress } = require("../../common/utils");
const { fetchModuleTransaction } = require("../../layers/safeApi/queries");

module.exports.moduletransaction = middlewareHandler(async (event) => {
  const module_transaction_id = event.query;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isTransactionHash(module_transaction_id)) {
      results = await fetchModuleTransaction(module_transaction_id);
   
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


