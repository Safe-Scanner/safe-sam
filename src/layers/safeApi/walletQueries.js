const { NETWORK_LIST } = require("../../common/constant");
const { isWalletAddress } = require("../../common/utils");
const axios = require("axios");
const { getAddress } = require("viem");

async function fetchBalances(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST).map(async ([endpointName, endpointUrl]) => {
    let modifiedEndpointUrl = endpointUrl.endpointUrl;

    if (isWalletAddress(queryAddress)) {
      modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${queryAddress}/balances/usd`;
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
  });

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    console.log("result---", results);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchOwnerWallet(queryAddress) {
  let results = [];
  queryAddress = getAddress(queryAddress);
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST).map(async ([endpointName, endpointUrl]) => {
    let modifiedEndpointUrl = endpointUrl.endpointUrl;

    if (isWalletAddress(queryAddress)) {
      modifiedEndpointUrl = `${modifiedEndpointUrl}owners/${queryAddress}/safes`;
    }

    try {
      // Make an HTTP GET request to the network endpoint
      const response = await axios.get(modifiedEndpointUrl);

      if (response.status === 200) {
        // Add the response data to the result array
        if (response.data && response.data.safes.length)
          results.push({ [endpointName]: response.data });
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
  });

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchWallet(queryAddress, network) {
  let results = [];
  queryAddress = getAddress(queryAddress);
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      if (isWalletAddress(queryAddress)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${queryAddress}`;
      }

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);
        const creationResult = await fetchCreation(queryAddress, network);

        if (response.status === 200) {
          if (response.data && creationResult) {
            const networkName = Object.keys(creationResult[0])[0];
            const createdObject = creationResult[0][networkName];
            response.data = {
              ...response.data,
              creationData: {
                ...createdObject,
              },
            };
            if (response.data) results.push({ [endpointName]: response.data });
          }
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
    });

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    console.log("result---", results);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchCreation(queryAddress, network) {
  let results = [];
  queryAddress = getAddress(queryAddress);
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      if (isWalletAddress(queryAddress)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${queryAddress}/creation/`;
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
    });

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    console.log("result---", results);
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = {
  fetchOwnerWallet,
  fetchWallet,
};
