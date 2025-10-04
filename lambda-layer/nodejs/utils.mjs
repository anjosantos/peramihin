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
import { S3Client } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);
const textractClient = new TextractClient({
  region: "us-east-2",
});

const s3Client = new S3Client({ region: "us-east-2" });

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
  s3Client,
};
