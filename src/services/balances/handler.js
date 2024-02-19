// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress } = require("../../common/utils");
const { fetchERC20BalancesFromCovalent } = require("../../layers/covalentHQ/queries");
const { NETWORK_LIST } = require("../../common/constant");

module.exports.balances = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;
  // Initialize an array to store the results
  let results = [];
  if (!NETWORK_LIST[network]?.covalient_chain) {
    return {
      statusCode: 403,
      body: { message: "Invalid network" },
    };
  }
  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
    results = await fetchERC20BalancesFromCovalent(queryAddress, network);
    if (results.error) {
      return {
        statusCode: 200,
        body: { message: results.error_message },
      };
    }
    const totalQuoteSum = results.token.data.items.reduce((sum, item) => sum + item.quote, 0);
    const newData = results.token.data.items.map((item) => ({
      ...item,
      totalQuote: totalQuoteSum,
    }));
    if (newData.length <= 0) {
      return {
        statusCode: 200,
        body: { message: "No record found" },
      };
    }
    return { token: newData, nft: results.nft.data.items };
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }
});
