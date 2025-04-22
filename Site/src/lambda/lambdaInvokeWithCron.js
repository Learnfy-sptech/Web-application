import https from "https";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { URL } from "url";

const secret_name = "slack/webhook";
const region = "us-east-1";

const client = new SecretsManagerClient({ region: region });

async function getSlackWebhookUrl() {
    console.log("Recuperando URL do webhook do Secrets Manager..."); // Log de início
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
        const secret = response.SecretString;
        const secretObject = JSON.parse(secret);
        console.log("URL do Webhook recuperada:", secretObject.SLACK_WEBHOOK_URL); // Log para mostrar a URL
        return secretObject.SLACK_WEBHOOK_URL;
    } catch (error) {
        console.error("Erro ao recuperar o segredo:", error); // Log de erro
        throw error;
    }
};

export const handler = async (event) => {
    console.log("Evento recebido:", event); // Log para mostrar o evento recebido

    const slackUrlRaw = await getSlackWebhookUrl();
    const slackUrl = new URL(slackUrlRaw);

    const status = event.status || "DESCONHECIDO";
    const horario = event.executadoEm || new Date().toISOString();
    const container = event.container || "NÃO INFORMADO";

    const mensagem = {
        text: `Atualização diária detectada!*\n\n*Status:* ${status}\n*Horário:* ${horario}`
    };

    console.log("Mensagem a ser enviada para o Slack:", JSON.stringify(mensagem)); // Log da mensagem a ser enviada

    const options = {
        hostname: slackUrl.hostname,
        path: slackUrl.pathname, // Verifique se você está usando pathname e não path
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.on("data", () => { });
            res.on("end", resolve);
        });

        req.on("error", (err) => {
            console.error("Erro ao enviar para o Slack:", err); // Log de erro
            reject(err);
        });

        req.write(JSON.stringify(mensagem));
        req.end();
    });

    console.log("Notificação enviada ao Slack com sucesso!"); // Log de sucesso

    return {
        statusCode: 200,
        body: JSON.stringify("Notificação enviada ao Slack com sucesso!"),
    };
};
