const NETWORKS_ENDPOINTS_VERSION = "v1";

const NETWORK_LIST = {
  eth: {
    covalient_chain: "eth-mainnet",
    endpointUrl: `https://safe-transaction-mainnet.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  gno: {
    covalient_chain: "eth-goerli",
    endpointUrl: `https://safe-transaction-goerli.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  matic: {
    covalient_chain: "matic-mainnet",
    endpointUrl: `https://safe-transaction-polygon.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  bnb: {
    covalient_chain: "bsc-mainnet",
    endpointUrl: `https://safe-transaction-bsc.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  arb1: {
    covalient_chain: "arbitrum-mainnet",
    endpointUrl: `https://safe-transaction-arbitrum.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  oeth: {
    covalient_chain: "optimism-mainnet",
    endpointUrl: `https://safe-transaction-optimism.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  avax: {
    covalient_chain: "avalanche-mainnet",
    endpointUrl: `https://safe-transaction-avalanche.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  sep: {
    covalient_chain: "eth-sepolia",
    endpointUrl: `https://safe-transaction-sepolia.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
};

module.exports = {
  NETWORK_LIST,
};
