// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress, isTransactionHash } = require("../../common/utils");
const {
  fetchWallet,
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchTransactionHash,
  fetchOwnerWallet,
} = require("../../layers/safeApi/queries");

module.exports.search = middlewareHandler(async (event) => {
  const queryAddress = event.query;

  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
    results = await fetchOwnerWallet(queryAddress);
    if (results.length > 0) {
      const safeAddresses = results[0].safes;
      const safeResult = [];
      const safeAddressPromises = safeAddresses.map(async (safeAddress) => {
        const safeResults = await fetchWallet(safeAddress);
        safeResult.push(safeResults);
      });
      await Promise.all(safeAddressPromises);
      results = safeResult[0];
    } else {
      results = await fetchWallet(queryAddress);
    }
  } else if (isTransactionHash(queryAddress)) {
    results = await fetchMultiSignatureTransaction(queryAddress);

    if (results.length <= 0) {
      results = await fetchModuleTransaction(queryAddress);
    }
    if (results.length <= 0) {
      results = await fetchTransactionHash(queryAddress);
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
