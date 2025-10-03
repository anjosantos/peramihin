import {
  docClient,
  UpdateCommand,
  createResponse,
} from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const updateExpense = async (event) => {
  const { pathParameters, body } = event;

  const expenseId = pathParameters?.id;
  if (!expenseId) return createResponse(400, { error: "Missing expenseId" });

  const { totalAmount, date } = JSON.parse(body || "{}");
  if (!totalAmount && date === undefined)
    return createResponse(400, { error: "Nothing to update!" });

  let updateExpression = `SET  ${
    totalAmount ? "totalAmount = :totalAmount, " : ""
  }${date ? "#dt = :newDate, " : ""}`.slice(0, -2);
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  try {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        expenseId,
        userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: {
        "#dt": "date", // Map #dt to the actual attribute name "date"
      },
      ExpressionAttributeValues: {
        ...(totalAmount && { ":totalAmount": totalAmount }),
        ...(date && { ":newDate": date }),
      },
      ReturnValues: "ALL_NEW", // returns updated value as response
      ConditionExpression: "attribute_exists(expenseId)", // ensures the item exists before updating
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
  } catch (err) {
    if (err.message === "The conditional request failed")
      return createResponse(404, { error: "Item does not exists!" });
    return createResponse(500, {
      error: "Internal Server Error!",
      message: err.message,
    });
  }
};
