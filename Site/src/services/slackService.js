const axios = require("axios");
require("dotenv").config();

async function enviarNotificacaoSlack(texto) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    await axios.post(webhookUrl, {
      text: texto,
    });
  } catch (error) {
    console.error("[SLACK] Erro ao enviar notificação:", error.message);
  }
}

module.exports = { enviarNotificacaoSlack };