const { NETWORK_LIST } = require("../../common/constant");
const axios = require("axios");

const getPoweredBy = async (beneficiary = "", paymaster) => {

  const response  = `https://2wfk6evtcd.execute-api.us-east-2.amazonaws.com/default/getPoweredByValues?paymaster=${paymaster}`
  const result = "https://xe2kr8t49e.execute-api.us-east-2.amazonaws.com/default/getAAAddressMapping"

  const config = {
    headers: { "x-api-key": process.env.JIFFYSCAN_X_API_KEY },
  }

  const [responseData,resultData] = await axios.all([
    axios.get(response, config),
    axios.get(result),
  ]);

  return { data: responseData.data, resultData: resultData.data };
};
module.exports = {
  getPoweredBy,
};