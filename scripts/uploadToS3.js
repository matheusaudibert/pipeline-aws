const fs = require("fs");
const path = require("path");
const s3 = require("../config/s3");
require("dotenv").config();

async function uploadToS3() {
  try {
    const filePath = path.join(__dirname, "../data/raw/messages.json");

    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `raw/messages-${Date.now()}.json`,
      Body: fileContent,
      ContentType: "application/json",
    };

    console.log("Enviando arquivo para S3...");

    const data = await s3.upload(params).promise();
    console.log("Upload feito com sucesso:", data.Location);
  } catch (error) {
    console.error("Erro ao enviar para S3:", error.message);
    process.exit(1);
  }
}

uploadToS3();
