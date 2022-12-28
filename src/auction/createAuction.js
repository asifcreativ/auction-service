const { v4: uuid } = require('uuid')

const dynamodb = require('aws-sdk/clients/dynamodb')
const docClient = new dynamodb.DocumentClient()

const tableName = process.env.AUCTIONS_TABLE_NAME

/**
 * HTTP post method to add one item/auction to a DynamoDB table.
 */
exports.createAuction = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    )
  }
  console.info('received:', event)

  // Get title from the body of the request
  const { title } = JSON.parse(event.body)
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  }

  // Creates a new item, or replaces an old item with a new item
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  let response = {}

  try {
    const params = {
      TableName: tableName,
      Item: auction,
    }

    const result = await docClient.put(params).promise()

    response = {
      statusCode: 200,
      body: JSON.stringify(auction),
    }
  } catch (ResourceNotFoundException) {
    response = {
      statusCode: 404,
      // body: 'Unable to call DynamoDB. Table resource not found.',
      body: error.message,
    }
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
