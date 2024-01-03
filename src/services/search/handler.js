// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress, isTransactionHash, isModuleTransaction } = require("../../common/utils");
const {
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchTransactionHash,
} = require("../../layers/safeApi/transactionQueries");
const { fetchWallet, fetchOwnerWallet } = require("../../layers/safeApi/walletQueries");

module.exports.search = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];

  if (isWalletAddress(queryAddress)) {
    const [ownerResult, safeResults] = await Promise.all([
      fetchOwnerWallet(queryAddress, network),
      fetchWallet(queryAddress, network),
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
        const safesArray = data || [];
        for (const safedata of safesArray) {
          if (resultObject[network.toLowerCase()] !== undefined) {
            resultObject[network.toLowerCase()] = [
              ...new Set(resultObject[network.toLowerCase()].concat(safedata.address)),
            ];
          } else {
            resultObject[network.toLowerCase()] = [safedata.address];
          }
        }
      });
    });
    results = resultObject;
  } else if (isModuleTransaction(queryAddress)) {
    results = await fetchModuleTransaction(queryAddress, network);
    const resultObject = {};

    results.map((entry) => {
      Object.entries(entry).map(([network, data]) => {
        const safesArray = data || [];
        if (resultObject[network.toLowerCase()] !== undefined) {
          resultObject[network.toLowerCase()] = [
            ...new Set(resultObject[network.toLowerCase()].concat(safesArray.safe)),
          ];
        } else {
          resultObject[network.toLowerCase()] = [safesArray.safe];
        }
      });
    });
    results = resultObject;
  } else if (isTransactionHash(queryAddress)) {
    results = await fetchMultiSignatureTransaction(queryAddress, network);
    const resultObject = {};
    results.map((entry) => {
      Object.entries(entry).map(([network, data]) => {
        const safesArray = data || [];
        for (const safedata of safesArray) {
          if (resultObject[network.toLowerCase()] !== undefined) {
            resultObject[network.toLowerCase()] = [
              ...new Set(resultObject[network.toLowerCase()].concat(safedata.safe)),
            ];
          } else {
            resultObject[network.toLowerCase()] = [safedata.safe];
          }
        }
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
