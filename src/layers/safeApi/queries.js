const {
  NETWORKS_ENDPOINTS,
  COVALIENT_NETWORKS,
} = require("../../common/constant");
const { isWalletAddress, isTransactionHash } = require("../../common/utils");
const axios = require("axios");
const { getAddress } = require("viem");
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
  queryAddress = getAddress(queryAddress);
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
async function fetchTransactionHash(safetxhash) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

      if (isTransactionHash(safetxhash)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}multisig-transactions/${safetxhash}`;
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
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchAllTransactions(queryAddress, options) {
  const { ordering, limit, offset, executed, queued, trusted } = options;
  const results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${queryAddress}/all-transactions?`;
      modifiedEndpointUrl = `${modifiedEndpointUrl}limit=${limit}&offset=${offset}`;

      if (isWalletAddress(queryAddress)) {
        if (ordering) {
          modifiedEndpointUrl = `${modifiedEndpointUrl}&ordering=${ordering}`;
        }
        if (executed) {
          modifiedEndpointUrl = `${modifiedEndpointUrl}&executed=${executed}`;
        }
        if (queued) {
          modifiedEndpointUrl = `${modifiedEndpointUrl}&queued=${queued}`;
        }
        if (trusted) {
          modifiedEndpointUrl = `${modifiedEndpointUrl}&trusted=${trusted}`;
        }
        console.log("modifiedEndpointUrl===>", modifiedEndpointUrl);
        try {
          // Make an HTTP GET request to the network endpoint
          const response = await axios.get(modifiedEndpointUrl);
          const safeOwnerDetails = await fetchWallet(queryAddress);

          if (response.status === 200) {
            // Add the response data to the result array

            if (
              response.data.results.length > 0 &&
              safeOwnerDetails &&
              safeOwnerDetails.length > 0
            ) {
              const transactions = response.data.results;
              const transactionResult = [];
              for (const transaction of transactions) {
                // const safeWalletAddress = transaction.safe;
                for (const [key, walletDetail] of Object.entries(
                  safeOwnerDetails[0]
                )) {
                  const confirmationResult = [];

                  const owners = walletDetail.owners;
                  for (const owner of owners) {
                    const confirmations = transaction.confirmations;
                    if (confirmations && confirmations.length > 0)
                      for (const confirmation of confirmations) {
                        if (owner === confirmation.owner) {
                          confirmationResult.push({
                            ...confirmation,
                            confirmationSignStatus: "CONFIRMED",
                          });
                        } else {
                          confirmationResult.push({
                            owner: owner,
                            confirmationSignStatus: null,
                          });
                        }
                      }
                  }
                  transaction.confirmations = confirmationResult;
                }
                transactionResult.push(transaction);
              }
              response.data.results = transactionResult;
              results.push({ [endpointName]: response.data });
              return results;
              // Promise.resolve(results);
            }
          } else {
            // If the request was not successful, log an error message
            console.error(
              `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
            );
          }
        } catch (error) {
          // Handle any exceptions that may occur during the request
          console.error(`Error: ${error}`);
        }
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
async function fetchBalances(queryAddress) {
  let results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORKS_ENDPOINTS).map(
    async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl;

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
module.exports = {
  fetchOwnerWallet,
  fetchWallet,
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchTransactionHash,
  fetchBalances,
  fetchAllTransactions,
};
