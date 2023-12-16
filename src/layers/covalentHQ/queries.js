const { COVALIENT_NETWORKS } = require("../../common/constant");
const axios = require("axios");

/**
 * Fetch ERC20 token balances for a given address from the Covalent API.
 *
 * @param {string} address - Ethereum address to fetch ERC20 token balances for.
 * @param {string} network - Ethereum network (e.g., 'mainnet', 'testnet').
 * @returns {Promise<Object>} - A promise that resolves with the response data or rejects with an error.
 */
async function fetchERC20BalancesFromCovalent(address, network) {
  // Construct the Covalent API endpoint URL
  const url = `https://api.covalenthq.com/v1/${COVALIENT_NETWORKS[network]}/address/${address}/balances_v2/`;

  // Configuration for the Axios request
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: process.env.COVALENT_KEY,
      password: "",
    },
  };

  try {
    // Make the GET request to the Covalent API
    const response = await axios.get(url, config);
    // Return the response data (assuming you want to return data directly)
    return response.data;
  } catch (error) {
    // Handle errors, log to console, and return error details
    console.error("Error fetching data from Covalent:", error);
    return error.response?.data || error.message;
  }
}

// Export the function for use in other modules
module.exports = {
  fetchERC20BalancesFromCovalent,
};
