// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress, isTransactionHash, isModuleTransaction } = require("../../common/utils");
const {
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchTxFromSafe,
} = require("../../layers/safeApi/transactionQueries");
const { fetchWallet, fetchOwnerWallet } = require("../../layers/safeApi/walletQueries");
const { fetchUserOp } = require("../../layers/jiffyScan/userOp");
const { fetchAlchemyTransactionHash } = require("../../layers/alchemy/queries");

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
        const safesArray = data.address || [];
        resultObject[network.toLowerCase()] = [safesArray];
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
            ...new Set(resultObject[network.toLowerCase()].concat(safesArray.moduleTransactionId)),
          ];
        } else {
          resultObject[network.toLowerCase()] = [safesArray.moduleTransactionId];
        }
      });
    });
    results = resultObject;
  } else if (isTransactionHash(queryAddress)) {
    results = await fetchMultiSignatureTransaction(queryAddress, network);
    const resultObject = {};
    if (results.length <= 0) {
      results = await fetchUserOp(queryAddress, network);
      if (results.length <= 0) {
        const alchmyResponse = await fetchAlchemyTransactionHash(queryAddress, network);
        if (alchmyResponse?.safe) {
          results = await fetchTxFromSafe(
            alchmyResponse.safe,
            queryAddress,
            network,
            alchmyResponse.type
          );
          results.map((entry) => {
            Object.entries(entry).map(([network, data]) => {
              const safesArray = data || [];
              if (resultObject[network.toLowerCase()] !== undefined) {
                resultObject[network.toLowerCase()] = [
                  ...new Set(resultObject[network.toLowerCase()].concat(safesArray.transactionHash)),
                ];
              } else {
                resultObject[network.toLowerCase()] = [safesArray.transactionHash];
              }
            });
          });
          results = resultObject;
        }
      } else {
        results.map((entry) => {
          Object.entries(entry).map(([network, data]) => {
            const safesArray = data || [];
            for (const safedata of safesArray) {
              if (resultObject[network.toLowerCase()] !== undefined) {
                resultObject[network.toLowerCase()] = [
                  ...new Set(resultObject[network.toLowerCase()].concat(safedata.userOpHash)),
                ];
              } else {
                resultObject[network.toLowerCase()] = [safedata.userOpHash];
              }
            }
          });
        });
        results = resultObject;
      }
    } else {
      results.map((entry) => {
        Object.entries(entry).map(([network, data]) => {
          const safesArray = [data] || [];
          for (const safedata of safesArray) {
            if (resultObject[network.toLowerCase()] !== undefined) {
              resultObject[network.toLowerCase()] = [
                ...new Set(resultObject[network.toLowerCase()].concat(safedata.safeTxHash)),
              ];
            } else {
              resultObject[network.toLowerCase()] = [safedata.safeTxHash];
            }
          }
        });
      });
      results = resultObject;
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
  return results;
});
