// 'use strict';
const { middlewareHandler } = require("../middleware");
const axios = require("axios");

const { NETWORKS_ENDPOINTS } = require("../../common/constant");
const { isWalletAddress, isTransactionHash } = require("../../common/utils");

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
    }
  }

if(results.length <= 0){
  return {
    statusCode: 200,
    body: { message: "No record found" },
  }
}
  // Return the result array
  return results[0];
});

async function fetchOwnerWallet(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

      if (isWalletAddress(queryAddress)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}owners/${queryAddress}/safes`;
      }

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response.data && response.data.safes.length)
            results.push(response.data);
        } else {
          // If the request was not successful, log an error message
          console.error(
            `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
          );
        }
      } catch (error) {
        // Handle any exceptions that may occur during the request
        console.error(`Error: ${error.message}`);
      }
    }
  );

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchWallet(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

      if (isWalletAddress(queryAddress)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${queryAddress}`;
      }

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response.data) results.push({ [endpointName]: response.data });
        } else {
          // If the request was not successful, log an error message
          console.error(
            `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
          );
        }
      } catch (error) {
        // Handle any exceptions that may occur during the request
        console.error(`Error: ${error.message}`);
      }
    }
  );

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    console.log("result---", results);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchMultiSignatureTransaction(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

      modifiedEndpointUrl = `${modifiedEndpointUrl}multisig-transactions/${queryAddress}`;

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response.data) results.push({ [endpointName]: response.data });
        } else {
          // If the request was not successful, log an error message
          console.error(
            `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
          );
        }
      } catch (error) {
        // Handle any exceptions that may occur during the request
        console.error(`Error: ${error.message}`);
      }
    }
  );

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchModuleTransaction(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

      modifiedEndpointUrl = `${modifiedEndpointUrl}module-transaction/${queryAddress}`;

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response.data) results.push({ [endpointName]: response.data });
        } else {
          // If the request was not successful, log an error message
          console.error(
            `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
          );
        }
      } catch (error) {
        // Handle any exceptions that may occur during the request
        console.error(`Error: ${error.message}`);
      }
    }
  );

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchTransactionHash(queryAddress) {}
