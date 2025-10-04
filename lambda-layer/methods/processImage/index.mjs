import {
  textractClient,
  AnalyzeExpenseCommand,
  docClient,
  PutCommand,
  createResponse,
} from "/opt/nodejs/utils.mjs";

const tableName = process.env.tableName || "ExpensesTable";

export const handler = async (event) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    console.log(`Analyzing receipt: ${bucket}/${key}`);

    const response = await textractClient.send(
      new AnalyzeExpenseCommand({
        Document: { S3Object: { Bucket: bucket, Name: key } },
      })
    );

    let extracted = {
      date: null,
      subtotal: null,
      taxes: {},
      total: null,
      items: [],
    };

    for (const doc of response.ExpenseDocuments) {
      // --- Summary fields (date, subtotal, taxes, total) ---
      for (const field of doc.SummaryFields) {
        const type = field.Type?.Text?.toUpperCase();
        const value = field.ValueDetection?.Text;

        if (type?.includes("DATE")) extracted.date = value;
        if (type?.includes("SUBTOTAL")) extracted.subtotal = value;
        if (type?.includes("TOTAL")) extracted.total = value;

        // Detect tax fields (e.g. GST, PST, VAT, TAX)
        if (type?.includes("TAX")) {
          const label = field.LabelDetection?.Text || "TAX";
          extracted.taxes[label] = value;
        }
      }

      // --- Line items (products/services purchased) ---
      for (const lineItemGroup of doc.LineItemGroups || []) {
        for (const item of lineItemGroup.LineItems || []) {
          let itemData = {};
          for (const field of item.LineItemExpenseFields || []) {
            const fieldType = field.Type?.Text?.toUpperCase();
            const fieldValue = field.ValueDetection?.Text;

            if (fieldType?.includes("ITEM")) itemData.name = fieldValue;
            if (fieldType?.includes("QUANTITY")) itemData.quantity = fieldValue;
            if (fieldType?.includes("PRICE")) itemData.price = fieldValue;
            if (fieldType?.includes("AMOUNT")) itemData.total = fieldValue;
          }
          extracted.items.push(itemData);
        }
      }
    }

    console.log("Extracted Receipt Data:", JSON.stringify(extracted, null, 2));

    const [userId, expenseId] = key.split("/");

    console.log(`User Id: ${userId}. Expense Id: ${expenseId}`);
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        userId,
        expenseId,
        totalAmount: extracted.total,
        date: extracted.date,
        subtotal: extracted.subtotal,
      },
    });

    console.log("PutCommand details:", JSON.stringify(command, null, 2));
    try {
      console.log("Sending command to DynamoDB...");
      const responsePostExpense = await docClient.send(command);
      console.log("Response Post Expense:", JSON.stringify(responsePostExpense, null, 2));
    } catch (err) {
      console.error("DynamoDB Error:", err);
      if (err.message === "The conditional request failed")
        return createResponse(409, { error: "Item already exists!" });
      else
        return createResponse(500, {
          error: "Internal Server Error!",
          message: err.message,
        });
    }

    return createResponse(200, extracted);
  } catch (err) {
    console.error("Error:", err);
    return createResponse(500, { error: err.message });
  }
};
