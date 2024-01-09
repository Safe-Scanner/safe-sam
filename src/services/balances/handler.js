// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress } = require("../../common/utils");
const { fetchERC20BalancesFromCovalent } = require("../../layers/covalentHQ/queries");

module.exports.balances = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;
  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
    results = await fetchERC20BalancesFromCovalent(queryAddress, network);
    if (results.error) {
      return {
        statusCode: 200,
        body: { message: results.error_message },
      };
    }
    const totalQuoteSum = results.data.items.reduce((sum, item) => sum + item.quote, 0);
    const newData = results.data.items.map((item) => ({
      ...item,
      totalQuote: totalQuoteSum,
    }));
    if (newData.length <= 0) {
      return {
        statusCode: 200,
        body: { message: "No record found" },
      };
    }
    return newData;
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }
});
