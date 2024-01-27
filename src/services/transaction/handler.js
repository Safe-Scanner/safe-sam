// 'use strict';
const { middlewareHandler } = require("../middleware");

const {
  fetchTxFromSafe,
  fetchModuleTransaction,
  fetchMultiSignatureTransaction,
} = require("../../layers/safeApi/transactionQueries");
const { fetchAlchemyTransactionHash } = require("../../layers/alchemy/queries");
const { isModuleTransaction, isTransactionHash } = require("../../common/utils");
const { TRANSACTION_TYPES } = require("../../common/constant");
const { fetchUserOp } = require("../../layers/jiffyScan/userOp");

module.exports.transaction = middlewareHandler(async (event) => {
  const txHash = event.hash;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];
  const alchmyResponse = await fetchAlchemyTransactionHash(txHash, network);
  // Fetch data for all endpoints concurrently
  if (alchmyResponse?.safe) {
    results = await fetchTxFromSafe(alchmyResponse.safe, txHash, network, alchmyResponse.type);
    if (results.length > 0) {
      results = {
        type: alchmyResponse.type,
        network: network,
        transactionInfo: results[0],
      };
    }
  } else if (isModuleTransaction(txHash)) {
    results = await fetchModuleTransaction(txHash, network);
    if (results.length > 0) {
      results = {
        type: TRANSACTION_TYPES.MODULE,
        network: Object.keys(results[0])[0],
        transactionInfo: results[0][Object.keys(results[0])[0]],
      };
    }
  } else if (isTransactionHash(txHash)) {
    results = await fetchMultiSignatureTransaction(txHash, network);
    if (results.length > 0) {
      results = {
        type: TRANSACTION_TYPES.MULTI,
        network: Object.keys(results[0])[0],
        transactionInfo: results[0][Object.keys(results[0])[0]],
      };
    } else {
      results = await fetchUserOp(txHash, network);
      if (results.length > 0)
        results = {
          type: TRANSACTION_TYPES.USEROPS,
          network: network,
          transactionInfo: results[0][Object.keys(results[0])[0]][0],
        };
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
