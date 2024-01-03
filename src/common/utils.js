function isTransactionHash(input) {
  const transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/;

  return transactionHashRegex.test(input);
}

function isWalletAddress(input) {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressRegex.test(input);
}
function isModuleTransaction(input) {
  const moduletransactionregex = /^[a-iA-F0-9]{67}$/;
  return moduletransactionregex.test(input);
}

module.exports = {
  isTransactionHash,
  isWalletAddress,
  isModuleTransaction,
};
