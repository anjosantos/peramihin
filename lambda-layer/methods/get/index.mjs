import {
  docClient,
  GetCommand,
  QueryCommand,
  createResponse,
} from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const getExpense = async (event) => {
  const { pathParameters } = event;
  const { id } = pathParameters || {};

  const userId = event.requestContext.authorizer.jwt.claims.sub;

  try {
    let command;
    if (id) {
      command = new GetCommand({
        TableName: tableName,
        Key: {
          userId,
          expenseId: id,
        },
      });
    } else {
      command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
      });
    }
    const response = await docClient.send(command);
    return createResponse(200, response);
  } catch (err) {
    console.error("Error fetching data from DynamoDB:", err);
    return createResponse(500, { error: err.message });
  }
};
