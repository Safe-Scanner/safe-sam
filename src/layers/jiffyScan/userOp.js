const { NETWORK_LIST } = require("../../common/constant");
const axios = require("axios");

async function fetchUserOp(txHash, network) {
  let results = [];
  const api_key = process.env.JIFFYSCAN_X_API_KEY;
  const jiffy_scan_endpoint = process.env.JIFFFY_SCAN_ENDPOINT;
  // Use Object.entries to convert the object into an array of key-value pairs
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName]) => {
      let modifiedEndpointUrl;
      if (NETWORK_LIST[endpointName]?.jiffysan_network) {
        modifiedEndpointUrl = `${jiffy_scan_endpoint}/getUserOp?hash=${txHash}`;
        modifiedEndpointUrl = `${modifiedEndpointUrl}&network=${NETWORK_LIST[endpointName]?.jiffysan_network}`;
        // Configuration for the Axios request
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": api_key,
          },
        };

        try {
          // Make an HTTP GET request to the network endpoint
          const response = await axios.get(modifiedEndpointUrl, config);

          if (response.status === 200) {
            // Add the response data to the result array
            if (response?.data?.userOps?.length > 0)
              results.push({ [endpointName]: response.data.userOps });
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
  fetchUserOp,
};