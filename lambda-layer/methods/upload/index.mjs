import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, parse } from "/opt/nodejs/utils.mjs";

const bucketName = process.env.BUCKET_NAME;

export const handler = async (event) => {
  try {
    // Parse multipart form data
    const parsed = await parse(event);
    console.log(parsed);
    const files = parsed.files || [];

    if (files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No files found in form data" }),
      };
    }

    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const uploadedFiles = [];

    // Process all files
    for (const file of files) {
      const expenseId = crypto.randomUUID();

      // Get file buffer and content type
      const buffer = file.content;
      const contentType = file.contentType || "application/octet-stream";
      const fileName = file.filename || "uploaded-file";

      // Preserve extension if present
      const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
      const key = ext ? `${userId}/${expenseId}.${ext}` : `${userId}/${expenseId}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          Metadata: {
            originalName: fileName,
          },
        })
      );

      uploadedFiles.push({
        fileUrl: `https://${bucketName}.s3.amazonaws.com/${key}`,
        fileName: fileName,
        contentType: contentType,
        expenseId: expenseId,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Upload successful",
        files: uploadedFiles,
        count: uploadedFiles.length,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Upload failed", error: error.message }),
    };
  }
};
