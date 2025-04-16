const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

exports.handler = async (event) => {
    const instanceId = "i-045e031ef8cd651c2";

    const s3Info = event.Records[0].s3;
    const bucket = s3Info.bucket.name;
    const key = decodeURIComponent(s3Info.object.key.replace(/\+/g, ' '));

    console.log("Novo arquivo detectado no S3:", key);

    const dockerCommand = `docker run --rm --network learnfy-network container-java-image`;

    const params = {
        DocumentName: "AWS-RunShellScript",
        InstanceIds: [instanceId],
        Parameters: {
            commands: [dockerCommand],
        },
    };

    try {
        const response = await ssm.sendCommand(params).promise();
        console.log("Container executado com sucesso:", response);
        return {
            statusCode: 200,
            body: JSON.stringify("Container executado com sucesso!"),
        };
    } catch (error) {
        console.error("Erro ao executar o container:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Erro ao executar o container!"),
        };
    }
};
