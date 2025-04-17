const AWS = require("aws-sdk")
const { v4: uuidv4 } = require("uuid")
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {
    const { body } = event
    const { title, type, collection, tags, content, fileContent, mimeType, userId } = JSON.parse(body)

    // Generate a unique ID for the resource
    const resourceId = `res_${uuidv4()}`

    // Create resource object
    const resource = {
      id: resourceId,
      title,
      type,
      collection,
      tags: tags || [],
      dateAdded: new Date().toISOString().split("T")[0],
      date: "Just now",
      createdAt: Date.now(),
      userId,
    }

    // Handle different resource types
    if (type === "document" && fileContent) {
      // For documents, store the file in S3
      const s3Key = `${userId}/${resourceId}/${title}`

      // Convert base64 to buffer
      const buffer = Buffer.from(fileContent, "base64")

      await s3
        .putObject({
          Bucket: process.env.RESOURCES_BUCKET,
          Key: s3Key,
          Body: buffer,
          ContentType: mimeType || "application/octet-stream",
        })
        .promise()

      // Add S3 reference to resource
      resource.s3Key = s3Key
      resource.size = `${Math.round((buffer.length / 1024) * 10) / 10} KB`
      resource.format = title.split(".").pop().toLowerCase()
    } else if (type === "url" && content) {
      // For URLs, store the content directly in DynamoDB
      resource.url = content
      resource.content = content // This would be the extracted content from the URL
    }

    // Store resource metadata in DynamoDB
    await dynamoDB
      .put({
        TableName: process.env.RESOURCES_TABLE,
        Item: resource,
      })
      .promise()

    // Update collection count
    if (collection) {
      await dynamoDB
        .update({
          TableName: process.env.COLLECTIONS_TABLE,
          Key: { id: collection },
          UpdateExpression: "ADD count :inc",
          ExpressionAttributeValues: {
            ":inc": 1,
          },
        })
        .promise()
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        success: true,
        resource,
      }),
    }
  } catch (error) {
    console.error("Error creating resource:", error)

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
