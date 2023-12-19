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
    const [ownerResult, safeResults] = await Promise.all([
      fetchOwnerWallet(queryAddress),
      fetchWallet(queryAddress),
    ]);

    const resultObject = {};

    ownerResult.map((entry) => {
      Object.entries(entry).map(([network, data]) => {
        const safesArray = data.safes || [];
        resultObject[network.toLowerCase()] = [...new Set(safesArray)];
      });
    });

    safeResults.map((entry) => {
      Object.entries(entry).map(([network, data]) => {
        const safesArray = data.address || [];
        if (resultObject[network.toLowerCase()] !== undefined) {
          resultObject[network.toLowerCase()] = [
            ...new Set(resultObject[network.toLowerCase()].concat(safesArray)),
          ];
        } else {
          resultObject[network.toLowerCase()] = [safesArray];
        }
      });
    });
    results = resultObject;
    // console.log("ownerResult",result)
  } else if (isTransactionHash(queryAddress)) {
    results = await fetchMultiSignatureTransaction(queryAddress);
    const resultObject = {};
    if (results.length <= 0) {
      results = await fetchModuleTransaction(queryAddress);
    }
    if (results.length <= 0) {
      results = await fetchTransactionHash(queryAddress);
    }
    results.map((entry) => {
      Object.entries(entry).map(([network, data]) => {
        const safesArray = data.safeTxHash || [];
        resultObject[network.toLowerCase()] = [safesArray];
      });
    });
    results = resultObject;
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
  return results;
});
