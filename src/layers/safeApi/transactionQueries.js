const { NETWORK_LIST } = require("../../common/constant");
const { isWalletAddress, isTransactionHash } = require("../../common/utils");
const axios = require("axios");
const { fetchWallet } = require("./walletQueries");

async function fetchModuleTransaction(queryAddress, network) {
  let results = [];
  // queryAddress = queryAddress;

  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
      modifiedEndpointUrl = `${modifiedEndpointUrl}module-transaction/${queryAddress}`;

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);

        if (response.status === 200) {
          // Add the response data to the result array
          if (response.data) results.push({ [endpointName]: response.data[0] });
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
async function fetchMultiSignatureTransaction(queryAddress, network) {
  let results = [];
  // queryAddress = queryAddress;

  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl = endpointUrl.endpointUrl;

      if (isTransactionHash(queryAddress)) {
        modifiedEndpointUrl = `${modifiedEndpointUrl}multisig-transactions/${queryAddress}`;
      }

      try {
        // Make an HTTP GET request to the network endpoint
        const response = await axios.get(modifiedEndpointUrl);
        const safeOwnerDetails = await fetchWallet(response.data.safe, network);

        if (response.status === 200) {
          if (response.data && safeOwnerDetails && safeOwnerDetails.length > 0) {
            const transactions = response.data;
            const transactionResult = [];
            if (transactions) {
              // const safeWalletAddress = transaction.safe;
              for (const safeOwnerDetail of safeOwnerDetails) {
                const ownerdata = safeOwnerDetail?.[network];
                if (ownerdata && ownerdata.length > 0) {
                  for (const ownerDetail of ownerdata) {
                    const confirmationResult = [];
                    const owners = ownerDetail.owners;
                    for (const owner of owners) {
                      const confirmations = transactions.confirmations;
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
                    transactions.confirmations = confirmationResult;
                  }
                }
              }
              transactionResult.push(transactions);
            }
            response.data = transactionResult;
            results.push({ [endpointName]: response.data[0] });
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
async function fetchAllTransactions(queryAddress, network, options) {
  const { ordering, limit, offset, executed, queued, trusted } = options;
  const results = [];
  // queryAddress = getAddress(queryAddress);
  // return;
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      let modifiedEndpointUrl;
      modifiedEndpointUrl = endpointUrl.endpointUrl;
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
        try {
          // Make an HTTP GET request to the network endpoint
          const response = await axios.get(modifiedEndpointUrl);
          const safeOwnerDetails = await fetchWallet(queryAddress, network);

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
                  const ownerdata = safeOwnerDetail?.[network];
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
    console.error(`Error All Transacrion: ${error.message}`);
  }
}

module.exports = {
  fetchMultiSignatureTransaction,
  fetchModuleTransaction,
  fetchAllTransactions,
};
