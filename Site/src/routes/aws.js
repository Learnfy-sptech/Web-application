var express = require("express");
var router = express.Router();
const multer = require("multer"); // Middleware para upload de arquivos, já que o express não faz isso nativamente
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv");

const storage = multer.memoryStorage(); // Armazena o arquivo na memória
const upload = multer({ storage: storage });

dotenv.config();
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccess_key = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccess_key,
    },
});

// Nome do campo do arquivo no formulário que vai no upload
// Exemplo: se o campo do arquivo no formulário é "file", use "file" aqui
router.post("/posts", upload.single("file"), async (req, res) => {
    console.log("Título:", req.body.title);
    console.log("Arquivo recebido:", req.file);
    req.file.buffer; // Aqui está o arquivo recebido

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `planilhas/${req.body.tipoDado}/${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    await s3.send(command).then(
        (data) => {
            console.log("Arquivo enviado com sucesso!", data);
            res.json({ message: "Upload realizado com sucesso!", file: req.file.originalname });
        },
        (err) => {
            console.log("Erro ao enviar arquivo:", err);
            res.status(500).json({ error: "Erro ao enviar o arquivo para a AWS S3" });
        }
    );
});

module.exports = router;