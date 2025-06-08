const AWS = require('aws-sdk');
const axios = require('axios');

const slackToken = process.env.SLACK_BOT_TOKEN;

exports.handler = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const { nomeEmpresa, nome, email, perfil } = body;

        const channelName = `empresa-${nomeEmpresa.toLowerCase().replace(/\s/g, '-')}`;

        const slackResponse = await axios.post(
            'https://slack.com/api/conversations.create',
            { name: channelName, is_private: true },
            { headers: { Authorization: `Bearer ${slackToken}` } }
        );

        const channelId = slackResponse.data.channel.id;

        await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: channelId,
                text: `🎉 Nova empresa cadastrada: *${nomeEmpresa}*\nResponsável: ${nome} (${perfil})\nEmail: ${email}`
            },
            { headers: { Authorization: `Bearer ${slackToken}` } }
        );
    }

    return { statusCode: 200 };
};
