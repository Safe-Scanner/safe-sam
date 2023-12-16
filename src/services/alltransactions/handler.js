// 'use strict';
const { middlewareHandler } = require("../middleware");

const { isWalletAddress } = require("../../common/utils");
const { fetchAllTransactions } = require("../../layers/safeApi/queries");

module.exports.alltransactions = middlewareHandler(async (event) => {
  const queryAddress = event.query;
  const { ordering, offset, executed, queued, trusted , limit  } = event;

  // Initialize an array to store the results
  let results = [];
  const pageSize = limit ? limit : 25 ;
  const page = (offset - 1) * pageSize ? (offset - 1) * pageSize : 0 ;
  const orderList = ordering ? ordering :"";
  const isExecuted = !!executed;
  const isTrusted = !!trusted;
  const isQueued = !!queued;

  // Fetch data for all endpoints concurrently
  if (isWalletAddress(queryAddress)) {
      results = await fetchAllTransactions(queryAddress,{
        ordering:orderList,
        limit:pageSize,
        offset:page,
        executed:isExecuted,
        queued:isTrusted,
        trusted:isQueued,
      });
   
  } else {
    return {
      statusCode: 403,
      body: { message: "Invalid request" },
    }
  }

  const filteredResults = results.filter((network) => network[Object.keys(network)].count > 0);

  if (filteredResults.length <= 0 ) {
    return {
      statusCode: 200,
      body: { message: orderList !== "execution_date" ?  "Ordering field is not valid, only `execution_date` is allowed" : "No record found or count is 0 for all networks"  },
    };
  }

  // Return the result array with counts greater than 0
  return filteredResults;
});


