import { docClient, PutCommand, createResponse } from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const postExpense = async (event) => {
  const { body } = event;
  const { expenseId, totalAmount, date } = JSON.parse(body || "{}");

  if (!expenseId || !totalAmount || !date) {
    return createResponse(409, {
      error:
        "Missing required attributes for the item: expenseId, totalAmount, or date.",
    });
  }

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      expenseId,
      totalAmount,
      date,
    },
    ConditionExpression: "attribute_not_exists(expenseId)",
  });

  try {
    const response = await docClient.send(command);
    return createResponse(201, {
      message: "Item Created Successfully!",
      response,
    });
  } catch (err) {
    if (err.message === "The conditional request failed")
      return createResponse(409, { error: "Item already exists!" });
    else
      return createResponse(500, {
        error: "Internal Server Error!",
        message: err.message,
      });
  }
};
