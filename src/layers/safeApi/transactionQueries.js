const { NETWORK_LIST, TRANSACTION_TYPES } = require("../../common/constant");
const { isWalletAddress, isTransactionHash, isModuleTransaction } = require("../../common/utils");
const axios = require("axios");
const { fetchWallet } = require("./walletQueries");

async function fetchModuleTransaction(txModuleId, network) {
  let results = [];
  // queryAddress = queryAddress;

  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}module-transaction/${txModuleId}`;

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
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchMultiSignatureTransaction(txHash, network) {
  let results = [];
  // queryAddress = queryAddress;

  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl.endpointUrl;

      if (isTransactionHash(txHash)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}multisig-transactions/${txHash}`;
      }

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);
        const safeOwnerDetails = await fetchWallet(response.data.safe, network);

        if (response.status === 200) {
          if (response.data && safeOwnerDetails && safeOwnerDetails.length > 0) {
            const transactions = response.data;
            const transactionResult = [];
            const owners = safeOwnerDetails[0]?.[Object.keys(safeOwnerDetails[0])[0]]?.owners;
            const confirmationResult = [];
            const foundOwners = new Set();

            if (transactions) {
              const confirmations = transactions.confirmations;
              if (confirmations && confirmations.length > 0) {
                confirmations.forEach((confirmation) => {
                  if (owners.includes(confirmation.owner)) {
                    confirmationResult.push({
                      ...confirmation,
                      confirmationSignStatus: "CONFIRMED",
                    });
                    foundOwners.add(confirmation.owner);
                  }
                });
              }
            }
            owners.forEach((owner) => {
              if (!foundOwners.has(owner)) {
                confirmationResult.push({ owner, confirmationSignStatus: null });
              }
            });
            transactions.confirmations = confirmationResult;

            transactionResult.push(transactions);
            response.data = transactionResult;
            results.push({ [endpointName]: response.data[0] });
            return results;
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
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
async function fetchAllTransactions(txHash, network, options) {
  const { ordering, first, skip, executed, queued, trusted } = options;
  const results = [];
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${txHash}/all-transactions?`;
      modifiedEndpointUrl = `${modifiedEndpointUrl}limit=${first}&offset=${skip}`;
      if (isWalletAddress(txHash)) {
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
        try {
          // Make an HTTP GET request to the network endpoint
          const response = await axios.get(modifiedEndpointUrl);
          const safeOwnerDetails = await fetchWallet(txHash, network);

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
                for (const safeOwnerDetail of safeOwnerDetails) {
                  const ownerdata = [safeOwnerDetail?.[Object.keys(safeOwnerDetail)[0]]];
                  if (ownerdata && ownerdata.length > 0) {
                    for (const ownerDetail of ownerdata) {
                      const confirmationResult = [];
                      const owners = ownerDetail.owners;
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
                  }
                }
                transactionResult.push(transaction);
              }
              response.data.results = transactionResult;
              results.push({ [endpointName]: response.data });
              return results;
            }
          } else {
            // If the request was not successful, log an error message
            console.error(
              `Error: Unable to fetch data from ${endpointName}. Status code: ${response.status}`
            );
          }
        } catch (error) {
          // Handle any exceptions that may occur during the request
          console.error(`Error:Modified ${error}`);
        }
      }
    });

  try {
    // Execute all requests concurrently
    await Promise.all(endpointPromises);
    return results;
  } catch (error) {
    console.error(`Error All Transaction: ${error.message}`);
  }
}

async function fetchTxFromSafe(address, txHash, network = null, txType = null) {
  let results = [];
  // queryAddress = queryAddress;
  if (txType === TRANSACTION_TYPES.MODULE || isModuleTransaction(txHash)) {
    txType = "module-transactions";
  } else {
    txType = "multisig-transactions";
  }
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}safes/${address}/${txType}/?transaction_hash=${txHash}`;

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response?.data?.results?.length > 0)
            results.push({ [endpointName]: response.data.results[0] });
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

async function postDataDecored(calldata, sender, network) {
  let results = [];
  // queryAddress = queryAddress;

  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}data-decoder/`;

      const raw = {
        'data':calldata,
        'to':sender
      }
     
      try {
        // Make an HTTP post request to the network endpoint
        const response = await axios.post(modifiedEndpointUrl,raw);
       

        if (response.status === 200) {
          // Add the response data to the result array
          if (response?.data) {
            if (
              response.data?.parameters?.length > 0 &&
              response?.data?.parameters[0]?.valueDecoded?.length > 0
            ) {
              results.push({
                dataDecoded: response.data?.parameters[0]?.valueDecoded[0]?.dataDecoded,
              });
            } else {
              results.push({
                dataDecoded: response.data,
              });
            }
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
    return results;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = {
  fetchTxFromSafe,
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchAllTransactions,
  postDataDecored,
};
