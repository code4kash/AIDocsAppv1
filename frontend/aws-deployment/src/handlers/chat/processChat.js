const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const { BedrockRuntime } = require("@aws-sdk/client-bedrock-runtime")

const bedrock = new BedrockRuntime({ region: process.env.AWS_REGION })

exports.handler = async (event) => {
  try {
    const { body } = event
    const { threadId, message, resourceIds, userId } = JSON.parse(body)

    // Store user message in DynamoDB
    const userMessageId = `msg_${Date.now()}`
    const userMessage = {
      id: userMessageId,
      threadId,
      userId,
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
      createdAt: Date.now(),
    }

    await dynamoDB
      .put({
        TableName: process.env.CHAT_MESSAGES_TABLE,
        Item: userMessage,
      })
      .promise()

    // Get resource content if resourceIds are provided
    let context = ""
    if (resourceIds && resourceIds.length > 0) {
      // Get resources from DynamoDB
      const resourcePromises = resourceIds.map((id) =>
        dynamoDB
          .get({
            TableName: process.env.RESOURCES_TABLE,
            Key: { id },
          })
          .promise(),
      )

      const resourceResults = await Promise.all(resourcePromises)
      const resources = resourceResults.map((result) => result.Item).filter(Boolean)

      // For document resources, get content from S3
      for (const resource of resources) {
        if (resource.type === "document" && resource.s3Key) {
          try {
            const s3Response = await s3
              .getObject({
                Bucket: process.env.RESOURCES_BUCKET,
                Key: resource.s3Key,
              })
              .promise()

            // Add resource content to context
            context += `\n\nContent from ${resource.title}:\n${s3Response.Body.toString("utf-8")}`
          } catch (error) {
            console.error(`Error fetching resource content from S3: ${error}`)
          }
        } else if (resource.type === "url" && resource.content) {
          // For URL resources, use the stored content
          context += `\n\nContent from ${resource.title} (${resource.url}):\n${resource.content}`
        }
      }
    }

    // Call Bedrock for AI response
    const prompt = context
      ? `You are an AI assistant helping with documents and resources. Use the following context to answer the user's question:\n\n${context}\n\nUser: ${message}`
      : `You are an AI assistant. Answer the following question: ${message}`

    const bedrockResponse = await bedrock.invokeModel({
      modelId: process.env.AWS_BEDROCK_MODEL_ID || "anthropic.claude-v2",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_tokens_to_sample: 2000,
        temperature: 0.7,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ["\n\nHuman:"],
      }),
    })

    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body))
    const aiContent = responseBody.completion || responseBody.generated_text

    // Store AI response in DynamoDB
    const aiMessageId = `msg_${Date.now() + 1}`
    const aiMessage = {
      id: aiMessageId,
      threadId,
      userId,
      content: aiContent,
      sender: "ai",
      timestamp: new Date().toISOString(),
      createdAt: Date.now(),
      usedResources: resourceIds,
    }

    await dynamoDB
      .put({
        TableName: process.env.CHAT_MESSAGES_TABLE,
        Item: aiMessage,
      })
      .promise()

    // Update thread with last message
    await dynamoDB
      .update({
        TableName: process.env.CHAT_THREADS_TABLE,
        Key: { id: threadId },
        UpdateExpression: "set lastMessage = :lastMessage, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":lastMessage": aiContent.substring(0, 100) + (aiContent.length > 100 ? "..." : ""),
          ":updatedAt": Date.now(),
        },
      })
      .promise()

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: {
          id: aiMessageId,
          content: aiContent,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          usedResources: resourceIds,
        },
      }),
    }
  } catch (error) {
    console.error("Error processing chat:", error)

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
