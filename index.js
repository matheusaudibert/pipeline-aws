const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

async function main() {
  try {
    console.log("Iniciando o processo de coleta e upload de mensagens...");

    console.log("📥 Buscando mensagens do Discord...");
    const { stdout: fetchOutput, stderr: fetchError } = await execAsync(
      "node scripts/fetchDiscordMessages.js",
      { timeout: 60000 }
    );

    if (fetchOutput) console.log(fetchOutput);
    if (fetchError) console.warn("Warnings:", fetchError);

    console.log("Mensagens coletadas com sucesso!");

    console.log("Enviando para S3...");
    const { stdout: uploadOutput, stderr: uploadError } = await execAsync(
      "node scripts/uploadToS3.js",
      { timeout: 30000 }
    );

    if (uploadOutput) console.log(uploadOutput);
    if (uploadError) console.warn("Warnings:", uploadError);

    console.log("Processo concluído com sucesso!");
  } catch (error) {
    console.error("Erro durante o processo:", error.message);
    if (error.killed && error.signal === "SIGTERM") {
      console.error("Processo cancelado por timeout");
    }
    if (error.stdout) console.log("Output:", error.stdout);
    if (error.stderr) console.error("Error output:", error.stderr);
    process.exit(1);
  }
}

main();
