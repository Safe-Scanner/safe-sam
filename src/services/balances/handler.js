// 'use strict';
const { middlewareHandler } = require("../middleware");
const axios = require("axios");

const { isWalletAddress } = require("../../common/utils");
const {
  fetchERC20BalancesFromCovalent,
} = require("../../layers/covalentHQ/queries");

module.exports.balances = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const network = event.network;
  // Initialize an array to store the results
  let results = [];

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
    results = await fetchERC20BalancesFromCovalent(queryAddress, network);
    console.log("results====>",results)
    if (results.error) {
      return {
        statusCode: 200,
        body: { message: results.statusText },
      };
    }
    return results.data.items;
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    };
  }
});
