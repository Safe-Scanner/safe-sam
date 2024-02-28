// 'use strict';
const { middlewareHandler } = require("../middleware");

const {
  fetchTxFromSafe,
  fetchModuleTransaction,
  fetchMultiSignatureTransaction,
  postDataDecored,
} = require("../../layers/safeApi/transactionQueries");
const { fetchAlchemyTransactionHash } = require("../../layers/alchemy/queries");
const { isModuleTransaction, isTransactionHash } = require("../../common/utils");
const { TRANSACTION_TYPES } = require("../../common/constant");
const { fetchUserOp } = require("../../layers/jiffyScan/userOp");
const { getPoweredBy } = require("../../layers/jiffyScan/poweredBy");

module.exports.transaction = middlewareHandler(async (event) => {
  const txHash = event.hash;
  const network = event.network;

  // Initialize an array to store the results
  let results = [];
  const alchmyPromise = fetchAlchemyTransactionHash(txHash, network);
  const userOpsPrimise = fetchUserOp(txHash, network);
  let [alchmyResponse, userOpResponse] = await Promise.all([alchmyPromise, userOpsPrimise]);
  if (userOpResponse.length > 0) {
    userOpResponse = userOpResponse[0];
    const key = Object.keys(userOpResponse)[0];
    const userOp = userOpResponse[key][0];
    const poweredByResponse = await getPoweredBy("", userOp.paymaster);
    const poweredresult  = poweredByResponse.resultData;
    let  sponsoredName = "";

    for (const key in poweredresult) {
      if (key === userOp.paymaster && poweredresult[key].type === "PAYMASTERS") {
        sponsoredName = poweredresult[key].company
      }
    }
    if (userOp.target.length > 0) {
      results = await postDataDecored(userOp.callData[0], userOp.target[0], network);
      if (results.length > 0) {
        results = {
          type: TRANSACTION_TYPES.USEROPS,
          network: key,
          transactionInfo: {
            ...userOp,
            dataDecoded: results[0].dataDecoded,
            sponsoredType: "Paymaster",
            sponsoredBy: sponsoredName,
          },
        };
      } else {
        results = {
          type: TRANSACTION_TYPES.USEROPS,
          network: key,
          transactionInfo: {
            ...userOp,
            sponsoredType: "Paymaster",
            dataDecoded: {},
            sponsoredBy: sponsoredName,
          },
        };
      }

    } else {
      results = {
        type: TRANSACTION_TYPES.USEROPS,
        network: key,
        transactionInfo: {
          ...userOp,
          sponsoredType: "Paymaster",
          dataDecoded: {},
          sponsoredBy: sponsoredName,
        },
      };
    }
  } else {
    // Fetch data for all endpoints concurrently
    if (alchmyResponse?.safe) {
      results = await fetchTxFromSafe(alchmyResponse.safe, txHash, network, alchmyResponse.type);
      if (results.length > 0) {
        results = {
          type: alchmyResponse.type,
          network: network,
          transactionInfo: {
            ...results[0][Object.keys(results[0])[0]],
            sponsoredBy: alchmyResponse.sponsoredBy,
            sponsorType: alchmyResponse.sponsorType,
          },
        };
      }
    } else if (isModuleTransaction(txHash)) {
      results = await fetchModuleTransaction(txHash, network);
      if (results.length > 0) {
        results = {
          type: TRANSACTION_TYPES.MODULE,
          network: Object.keys(results[0])[0],
          transactionInfo: {
            ...results[0][Object.keys(results[0])[0]],
            sponsoredBy: alchmyResponse.sponsoredBy,
            sponsorType: alchmyResponse.sponsorType,
          },
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
      }
    } else {
      return {
        statusCode: 403,
        body: { message: "Invalid request" },
      };
    }
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
