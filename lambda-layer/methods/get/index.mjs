import {
  docClient,
  GetCommand,
  ScanCommand,
  createResponse,
} from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const getExpense = async (event) => {
  const { pathParameters } = event;
  const { id } = pathParameters || {};

  try {
    let command;
    if (id) {
      command = new GetCommand({
        TableName: tableName,
        Key: {
          expenseId: id,
        },
      });
    } else {
      command = new ScanCommand({
        TableName: tableName,
      });
    }
    const response = await docClient.send(command);
    return createResponse(200, response);
  } catch (err) {
    console.error("Error fetching data from DynamoDB:", err);
    return createResponse(500, { error: err.message });
  }
};
