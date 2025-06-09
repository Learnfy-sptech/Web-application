const AWS = require("aws-sdk");
const axios = require("axios");
const mysql = require("mysql2/promise");

const slackToken = process.env.SLACK_BOT_TOKEN;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
};

exports.handler = async (event) => {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    for (const record of event.Records) {
      const { mensagem, data_execucao } = JSON.parse(record.body);

      const [empresas] = await connection.execute(`
        SELECT e.slack_channel_id, e.nomeEmpresa
        FROM empresa e
        INNER JOIN configuracao_notificacao c ON e.id = c.fk_empresa
        WHERE c.receber_notificacao_global = TRUE
          AND e.slack_channel_id IS NOT NULL
      `);

      for (const empresa of empresas) {
        const texto = `📢 *Atualização na Base de Dados!*\n\n${mensagem}\n🕒 ${data_execucao}`;
        await axios.post(
          "https://slack.com/api/chat.postMessage",
          {
            channel: empresa.slack_channel_id,
            text: texto
          },
          {
            headers: {
              Authorization: `Bearer ${slackToken}`
            }
          }
        );
      }
    }
  } catch (error) {
    console.error("[Lambda] Erro geral:", error.message, error.stack);
  } finally {
    if (connection) await connection.end();
  }

  return { statusCode: 200 };
};