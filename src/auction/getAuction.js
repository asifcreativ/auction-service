const tableName = process.env.AUCTIONS_TABLE_NAME

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb')
const docClient = new dynamodb.DocumentClient()

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.getAuction = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    )
  }
  console.info('received:', event)

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const id = event.pathParameters.id

  let response = {}

  try {
    const params = {
      TableName: tableName,
      Key: { id: id },
    }
    const data = await docClient.get(params).promise()
    const item = data.Item

    response = {
      statusCode: 200,
      body: JSON.stringify(item),
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
