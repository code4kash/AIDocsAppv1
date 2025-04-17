const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
  try {
    const { queryStringParameters } = event
    const params = {
      TableName: process.env.RESOURCES_TABLE,
    }

    // Apply filters if provided
    if (queryStringParameters) {
      const { collection, tag, type, query } = queryStringParameters

      if (collection) {
        // Query by collection using GSI
        params.IndexName = "CollectionIndex"
        params.KeyConditionExpression = "collection = :collection"
        params.ExpressionAttributeValues = {
          ":collection": collection,
        }
      }

      // Additional filters can be applied after fetching the initial results
    }

    let result
    if (params.KeyConditionExpression) {
      result = await dynamoDB.query(params).promise()
    } else {
      result = await dynamoDB.scan(params).promise()
    }

    let resources = result.Items

    // Apply additional filters that couldn't be done in the initial query
    if (queryStringParameters) {
      const { tag, type, query } = queryStringParameters

      if (tag) {
        resources = resources.filter((resource) => resource.tags && resource.tags.includes(tag))
      }

      if (type) {
        resources = resources.filter((resource) => resource.type === type)
      }

      if (query) {
        const lowerQuery = query.toLowerCase()
        resources = resources.filter((resource) => resource.title.toLowerCase().includes(lowerQuery))
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        resources,
      }),
    }
  } catch (error) {
    console.error("Error fetching resources:", error)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    }
  }
}
