const NETWORKS_ENDPOINTS_VERSION = "v1";
const { Network } = require("alchemy-sdk");
const chain = require("viem/chains");

const NETWORK_LIST = {
  eth: {
    covalient_chain: "eth-mainnet",
    endpointUrl: `https://safe-transaction-mainnet.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.ETH_MAINNET, chain: chain.mainnet },
  },
  gno: {
    covalient_chain: "eth-goerli",
    endpointUrl: `https://safe-transaction-goerli.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.ETH_GOERLI, chain: chain.goerli },
  },
  base: {
    covalient_chain: "base-mainnet",
    endpointUrl: `https://safe-transaction-goerli.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.BASE_MAINNET, chain: chain.base },
  },
  matic: {
    covalient_chain: "matic-mainnet",
    endpointUrl: `https://safe-transaction-polygon.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.MATIC_MAINNET, chain: chain.polygon },
  },
  bnb: {
    covalient_chain: "bsc-mainnet",
    endpointUrl: `https://safe-transaction-bsc.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  arb1: {
    covalient_chain: "arbitrum-mainnet",
    endpointUrl: `https://safe-transaction-arbitrum.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.ARB_MAINNET, chain: chain.arbitrum },
  },
  zkevm: {
    covalient_chain: "polygon-zkevm-mainnet",
    endpointUrl: `https://safe-transaction-arbitrum.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.POLYGONZKEVM_MAINNET, chain: chain.polygonZkEvm },
  },
  oeth: {
    covalient_chain: "optimism-mainnet",
    endpointUrl: `https://safe-transaction-optimism.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.OPT_MAINNET, chain: chain.optimism },
  },
  avax: {
    covalient_chain: "avalanche-mainnet",
    endpointUrl: `https://safe-transaction-avalanche.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  sep: {
    covalient_chain: "eth-sepolia",
    endpointUrl: `https://safe-transaction-sepolia.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
    alchemy: { network: Network.ETH_SEPOLIA, chain: chain.sepolia },
  },
  zksync: {
    covalient_chain: "zksync-mainnet",
    endpointUrl: `https://safe-transaction-zksync.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
  aurora: {
    covalient_chain: "aurora-mainnet",
    endpointUrl: `https://safe-transaction-zksync.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  },
};
const TRANSACTION_TYPES = {
  MODULE: "module",
  MULTI: "multi",
};
module.exports = {
  NETWORK_LIST,
  TRANSACTION_TYPES,
};
