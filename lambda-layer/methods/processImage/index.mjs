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
      date: "",
      subtotal: 0,
      taxes: {},
      total: 0,
      items: [],
    };

    for (const doc of response.ExpenseDocuments) {
      // --- Summary fields (date, subtotal, taxes, total) ---
      for (const field of doc.SummaryFields) {
        const type = field.Type?.Text?.toUpperCase();
        const value = field.ValueDetection?.Text;

        if (type?.includes("DATE")) extracted.date = value;
        if (type?.includes("SUBTOTAL"))
          extracted.subtotal =
            parseFloat(value?.replace(/[^0-9.-]/g, "")) || null;
        if (type?.includes("TOTAL"))
          extracted.total = parseFloat(value?.replace(/[^0-9.-]/g, "")) || null;

        // Detect tax fields (e.g. GST, PST, VAT, TAX)
        if (type?.includes("TAX")) {
          const label = field.LabelDetection?.Text || "TAX";
          extracted.taxes[label] =
            parseFloat(value?.replace(/[^0-9.-]/g, "")) || null;
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
            if (fieldType?.includes("QUANTITY"))
              itemData.quantity =
                parseFloat(fieldValue?.replace(/[^0-9.-]/g, "")) || null;
            if (fieldType?.includes("PRICE"))
              itemData.price =
                parseFloat(fieldValue?.replace(/[^0-9.-]/g, "")) || null;
            if (fieldType?.includes("AMOUNT"))
              itemData.total =
                parseFloat(fieldValue?.replace(/[^0-9.-]/g, "")) || null;
          }
          extracted.items.push(itemData);
        }
      }
    }

    console.log("Extracted Receipt Data:", JSON.stringify(extracted, null, 2));

    const [userId, expenseFileName] = key.split("/");
    const [expenseId, _] = expenseFileName.split(".");

    console.log(`User Id: ${userId}. Expense Id: ${expenseId}`);
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        userId,
        expenseId,
        totalAmount: extracted.total,
        date: extracted.date,
        subtotal: extracted.subtotal,
        taxes: extracted.taxes,
        items: extracted.items,
      },
    });

    console.log("PutCommand details:", JSON.stringify(command, null, 2));
    try {
      console.log("Sending command to DynamoDB...");
      const responsePostExpense = await docClient.send(command);
      console.log(
        "Response Post Expense:",
        JSON.stringify(responsePostExpense, null, 2)
      );
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
