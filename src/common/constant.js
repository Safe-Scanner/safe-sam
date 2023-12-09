const NETWORKS_ENDPOINTS_VERSION = "v1";

const NETWORKS = [
  "Arbitrum",
  "Aurora",
  "Avalanche",
  "Base",
  "BNB Smart Chain",
  "Celo",
  "Ethereum Mainnet",
  "Gnosis Chain",
  "Goerli",
  "Optimism",
  "Polygon",
  "Polygon zkEVM",
  "Sepolia",
  "zkSync Era Mainnet",
  // Add more network endpoints as needed
];


const NETWORKS_ENDPOINTS = {
  Arbitrum: `https://safe-transaction-arbitrum.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Aurora: `https://safe-transaction-aurora.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Avalanche: `https://safe-transaction-avalanche.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Base: `https://safe-transaction-base.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Celo: `https://safe-transaction-celo.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Goerli: `https://safe-transaction-goerli.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Optimism: `https://safe-transaction-optimism.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Polygon: `https://safe-transaction-polygon.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  Sepolia: `https://safe-transaction-sepolia.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  "zkSync Era Mainnet": `https://safe-transaction-zksync.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  "BNB Smart Chain": `https://safe-transaction-bsc.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  "Ethereum Mainnet": `https://safe-transaction-mainnet.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  "Gnosis Chain": `https://safe-transaction-gnosis-chain.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,
  "Polygon zkEVM": `https://safe-transaction-zkevm.safe.global/api/${NETWORKS_ENDPOINTS_VERSION}/`,

  // Add more network endpoints as needed
};
module.exports = {
  NETWORKS,
  NETWORKS_ENDPOINTS,
};
