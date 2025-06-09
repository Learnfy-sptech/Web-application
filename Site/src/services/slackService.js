const axios = require("axios");
require("dotenv").config();

const slackToken = process.env.SLACK_BOT_TOKEN;  // <--- Definição do token Slack

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

async function ensureSlackChannelExists(empresaNome) {
  const nomeFormatado = empresaNome.toLowerCase().replace(/\s+/g, "-");
  const channelName = `empresa-${nomeFormatado}`;

  try {
    const listResponse = await axios.get("https://slack.com/api/conversations.list", {
      headers: { Authorization: `Bearer ${slackToken}` },  // Usa token aqui
      params: { exclude_archived: true, limit: 1000 }
    });

    const canalExistente = listResponse.data.channels.find(
      (c) => c.name === channelName
    );

    console.log("[Slack] Canais existentes:", listResponse.data.channels.map(c => c.name));

    if (canalExistente) {
      return canalExistente.id;
    }

    const createResponse = await axios.post(
      "https://slack.com/api/conversations.create",
      { name: channelName },
      { headers: { Authorization: `Bearer ${slackToken}` } }
    );

    if (!createResponse.data.ok) throw new Error("Erro ao criar canal no Slack");

    console.log("[Slack] Resposta da criação do canal:", createResponse.data);


    return createResponse.data.channel.id;

  } catch (err) {
    if (err.response && err.response.data) {
      console.error("Erro ao criar canal Slack:", err.response.data);
    } else {
      console.error("Erro ao criar canal Slack:", err.message);
    }
    throw err;
  }
}

module.exports = {
  enviarNotificacaoSlack,
  ensureSlackChannelExists
};
