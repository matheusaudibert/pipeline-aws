const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const BASE_URL = "https://discord.com/api/v10";

async function fetchMessages() {
  try {
    if (!DISCORD_TOKEN || !CHANNEL_ID) {
      throw new Error(
        "DISCORD_TOKEN e CHANNEL_ID são obrigatórios no arquivo .env"
      );
    }

    const processedMessages = [];
    let lastMessageId = null;
    let hasMore = true;
    let requestCount = 0;

    while (hasMore && requestCount < 5) {
      console.log(`🔄 Fazendo request ${requestCount + 1}...`);

      const url = `${BASE_URL}/channels/${CHANNEL_ID}/messages`;
      const params = {
        limit: 100,
        ...(lastMessageId && { before: lastMessageId }),
      };

      console.log("URL:", url);
      console.log("Params:", params);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bot ${DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        params,
        timeout: 10000,
      });

      console.log(`Response recebida. Status: ${response.status}`);

      const batch = response.data;
      console.log(`Batch recebido com ${batch.length} mensagens`);

      if (batch.length === 0) {
        hasMore = false;
        console.log("Não há mais mensagens");
      } else {
        const processedBatch = batch
          .filter((msg) => msg.content && msg.content.trim() !== "")
          .map((msg) => ({
            id: msg.id,
            conteudo: msg.content,
            autor: {
              id: msg.author.id,
              nome: msg.author.username,
              displayName: msg.author.global_name || msg.author.username,
              bot: msg.author.bot || false,
            },
            data: msg.timestamp,
            dataFormatada: new Date(msg.timestamp).toLocaleString("pt-BR"),
            editado: msg.edited_timestamp
              ? new Date(msg.edited_timestamp).toLocaleString("pt-BR")
              : null,
            anexos: msg.attachments ? msg.attachments.length : 0,
            mencoes: msg.mentions ? msg.mentions.length : 0,
          }));

        processedMessages.push(...processedBatch);
        lastMessageId = batch[batch.length - 1].id;
        console.log(`Total processadas: ${processedMessages.length} mensagens`);

        console.log("Aguardando 1 segundo...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      requestCount++;
    }

    console.log("Criando diretório...");
    const dataDir = path.join(__dirname, "../data/raw");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    console.log("💾 Salvando arquivo...");
    const filePath = path.join(dataDir, "messages.json");

    processedMessages.sort((a, b) => new Date(b.data) - new Date(a.data));

    const jsonLines = processedMessages
      .map((msg) => JSON.stringify(msg))
      .join("\n");

    fs.writeFileSync(filePath, jsonLines);

    console.log(
      `${processedMessages.length} mensagens processadas e salvas em ${filePath}`
    );

    if (processedMessages.length > 0) {
      console.log("\nAmostra das mensagens coletadas:");
      processedMessages.slice(0, 3).forEach((msg, index) => {
        console.log(
          `\n${index + 1}. ${msg.autor.nome} (${msg.dataFormatada}):`
        );
        console.log(
          `   "${msg.conteudo.substring(0, 100)}${
            msg.conteudo.length > 100 ? "..." : ""
          }"`
        );
      });
    }
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error.message);
    if (error.code === "ECONNABORTED") {
      console.error("Timeout na requisição");
    }
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    if (error.request) {
      console.error("Request feito mas sem resposta");
    }
    process.exit(1);
  }
}

fetchMessages();
