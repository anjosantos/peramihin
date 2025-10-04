import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { parse } from "lambda-multipart-parser";
import {
  TextractClient,
  AnalyzeExpenseCommand,
} from "@aws-sdk/client-textract";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const textractClient = new TextractClient();

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

export {
  docClient,
  createResponse,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  parse,
  AnalyzeExpenseCommand,
  textractClient,
};
