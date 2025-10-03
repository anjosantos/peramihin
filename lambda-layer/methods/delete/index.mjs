import {
  docClient,
  DeleteCommand,
  createResponse,
} from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const deleteExpense = async (event) => {
  const { pathParameters } = event;
  const expenseId = pathParameters?.id;
  if (!expenseId) return createResponse(400, { error: "Missing expenseId" });

  const userId = event.requestContext.authorizer.jwt.claims.sub;

  try {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        userId,
        expenseId,
      },
      ReturnValues: "ALL_OLD", // returns deleted value as response
      ConditionExpression:
        "attribute_exists(userId) AND attribute_exists(expenseId)", // ensures the item exists before deleting
    });

    const response = await docClient.send(command);
    return createResponse(200, {
      message: "Item Deleted Successfully!",
      response,
    });
  } catch (err) {
    if (err.message === "The conditional request failed")
      return createResponse(404, { error: "Item does not exists!" });
    return createResponse(500, {
      error: "Internal Server Error!",
      message: err.message,
    });
  }
};
