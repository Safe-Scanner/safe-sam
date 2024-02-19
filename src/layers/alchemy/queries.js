const { createPublicClient, http, getAddress } = require("viem");

const { NETWORK_LIST, TRANSACTION_TYPES } = require("../../common/constant");
const chain = require("viem/chains");

const MODULE_TRANSACTION_TOPIC = process.env.MODULE_TRANSACTION_TOPIC;
const MULTI_SIGNATURE_TRANSACTION_TOPIC = process.env.MULTI_SIGNATURE_TRANSACTION_TOPIC;
const axios = require("axios");

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const fetchAlchemyTransactionHash = async (hash, network) => {
  let txInfo = {
    safe: "",
    type: "",
  };
  const endpointPromises = Object.entries(NETWORK_LIST)
    .filter(([endpointName]) => !network || endpointName.toLowerCase() === network.toLowerCase())
    .map(async ([endpointName, endpointUrl]) => {
      if (NETWORK_LIST[endpointName]?.alchemy?.network) {
        try {
          const alchemy = NETWORK_LIST[endpointName].alchemy;
          const receipt = await getTransactionReceipt(hash, alchemy);
          for (const log of receipt.logs) {
            if (log.topics[0] === MODULE_TRANSACTION_TOPIC) {
              txInfo.safe = getAddress(log.address);
              txInfo.type = TRANSACTION_TYPES.MODULE;
              break;
            } else if (log.topics[0] === MULTI_SIGNATURE_TRANSACTION_TOPIC) {
              txInfo.safe = getAddress(log.address);
              txInfo.type = TRANSACTION_TYPES.MULTI;
              break;
            }
          }
          console.log(txInfo);
          return txInfo;
        } catch (e) {
          console.log("Error in AlchemyApi ", e);
        }
      }
    });
  try {
    await Promise.all(endpointPromises);
    return txInfo;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
async function getUserOperationReceipt(hash, alchemy) {
  const options = {
    method: "POST",
    url: `https://${alchemy.network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    headers: { accept: "application/json", "content-type": "application/json" },
    data: {
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getUserOperationReceipt",
      params: [hash],
    },
  };
  let receipt = await axios.request(options);

  return receipt.data.result;
}
async function getTransactionReceipt(hash, alchemy) {
  const options = {
    method: "POST",
    url: `https://${alchemy.network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    headers: { accept: "application/json", "content-type": "application/json" },
    data: {
      id: 1,
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [hash],
    },
  };
  let receipt = await axios.request(options);

  return receipt.data.result;
}
module.exports = {
  fetchAlchemyTransactionHash,
};
