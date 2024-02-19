const { NETWORK_LIST } = require("../../common/constant");
const axios = require("axios");

const getPoweredBy = async (beneficiary = "", paymaster) => {
  const response = await fetch(
    "https://2wfk6evtcd.execute-api.us-east-2.amazonaws.com/default/getPoweredByValues?paymaster=" +
      paymaster,
    {
      headers: { "x-api-key": process.env.JIFFYSCAN_X_API_KEY },
    }
  );

  const data = await response.json();
  if (data) {
    return data;
  }
  return {};
};
module.exports = {
  getPoweredBy,
};
