module.exports.middlewareHandler = (lambda) => {
  return async function (event, context) {
    let body, statusCode;
    // console.log("event in handler", event);
    // Get params from event
    let params;
    if (event.body) {
      // If it has an event body should not be GET (uses query params)
      if (event.httpMethod === "GET") {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: "Invalid request" }),
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
        };
      }
      params = JSON.parse(event.body);
    } else {
      params = event.queryStringParameters || {};
    }

    // Get User
    // Extract User from Request Context

    try {
      body = await lambda(params);
      statusCode = 200;
    } catch (e) {
      body = { Error: e.stack };
      console.error(`Handler Error event: ${JSON.stringify(event)}`);
      console.error(`Handler Error params: ${JSON.stringify(params)}`);
      console.error(`Handler Error: ${e.stack}`);
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
};
