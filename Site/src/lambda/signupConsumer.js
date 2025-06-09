const AWS = require('aws-sdk');
const axios = require('axios');
const mysql = require('mysql2/promise'); // caso precise consultar preferências

const slackToken = process.env.SLACK_BOT_TOKEN;
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

exports.handler = async (event) => {
  const conn = await mysql.createConnection(connectionConfig);

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { tipo_notificacao, mensagem, empresas_alvo } = body;

    for (const empresaId of empresas_alvo) {
      const [rows] = await conn.execute(
        `SELECT * FROM configuracao_notificacao_empresa WHERE fk_empresa = ?`,
        [empresaId]
      );

      const config = rows[0];

      if (!config) continue;
      if (!config.receber_notificacao_global) continue;

      let deveNotificar = false;

      if (tipo_notificacao === 'NOVA_BASE_EMPREGABILIDADE' && config.nova_base_empregabilidade) {
        deveNotificar = true;
      } else if (tipo_notificacao === 'NOVA_BASE_ENSINO' && config.nova_base_ensino) {
        deveNotificar = true;
      }

      if (deveNotificar) {
        await axios.post(
          'https://slack.com/api/chat.postMessage',
          {
            channel: '#learnfy-noticias',
            text: mensagem
          },
          {
            headers: {
              Authorization: `Bearer ${slackToken}`
            }
          }
        );
      }
    }
  }

  await conn.end();
  return { statusCode: 200 };
};
