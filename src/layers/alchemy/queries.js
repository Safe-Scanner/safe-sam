const { createPublicClient, http, getAddress } = require("viem");

const { NETWORK_LIST, TRANSACTION_TYPES } = require("../../common/constant");
const chain = require("viem/chains");

const MODULE_TRANSACTION_TOPIC = process.env.MODULE_TRANSACTION_TOPIC;
const MULTI_SIGNATURE_TRANSACTION_TOPIC = process.env.MULTI_SIGNATURE_TRANSACTION_TOPIC;

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const fetchAlchemyTransactionHash = async (hash, network) => {
  if (!NETWORK_LIST[network]?.alchemy.network) {
    return {
      error: "Invalid network",
      code: 400,
    };
  }
  try {
    const alchemy = NETWORK_LIST[network].alchemy;
    const client = createPublicClient({
      chain: chain[alchemy.chain],
      transport: http(`https://${alchemy.network}.g.alchemy.com/v2/` + ALCHEMY_API_KEY),
    });
    const receipt = await client.getTransactionReceipt({ hash: hash });

    let txInfo = {
      safe: "",
      type: "",
    };
    for (const log of receipt.logs) {
      if (log.topics[0] === MODULE_TRANSACTION_TOPIC) {
        txInfo.safe = log.address;
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
};

module.exports = {
  fetchAlchemyTransactionHash,
};
