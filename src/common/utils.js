function isTransactionHash(input) {
  const transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/;

  return transactionHashRegex.test(input);
}

function isWalletAddress(input) {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressRegex.test(input);
}
module.exports = {
  isTransactionHash,
  isWalletAddress,
}