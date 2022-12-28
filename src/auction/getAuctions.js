const tableName = process.env.AUCTIONS_TABLE_NAME

const dynamodb = require('aws-sdk/clients/dynamodb')
const docClient = new dynamodb.DocumentClient()

/**
 * HTTP get method to get all items from a DynamoDB table.
 */
exports.getAuctions = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${event.httpMethod}`
    )
  }
  console.info('received:', event)

  let response = {}

  try {
    const params = {
      TableName: tableName,
    }
    const data = await docClient.scan(params).promise()
    const items = data.Items

    response = {
      statusCode: 200,
      body: JSON.stringify(items),
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
