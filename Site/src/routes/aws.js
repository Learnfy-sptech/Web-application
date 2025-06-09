const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

router.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

dotenv.config();
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId,
        secretAccessKey
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
        ContentType: req.file.mimetype
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
    fs.unlinkSync(req.file.path); // Remove o arquivo temporário
});

// ATUALIZAR FOTOS DE PERFIL DE USUÁRIO //
router.post(
    "/usuarios/:id/imagem-perfil",
    upload.single("file"),
    async (req, res) => {
        const userId = req.params.id;
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        const key = `fotos-usuario/${userId}.jpg`;
        const cmd = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        });

        try {
            await s3.send(cmd);
            res.json({ message: "Imagem de perfil enviada com sucesso!" });
        } catch (err) {
            console.error("Erro ao enviar imagem:", err);
            res.status(500).json({ error: "Erro ao enviar a imagem para o S3" });
        }
    }
);

router.get(
    "/usuarios/:id/importar-imagem",
    async (req, res) => {
        const userId = req.params.id;
        const key = `fotos-usuario/${userId}.jpg`;

        const cmd = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        try {
            const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
            res.json({ imageUrl: url });
        } catch (err) {
            console.error("Erro ao recuperar imagem:", err);
            if (err.name === "NoSuchKey" || /NotFound/.test(err.message)) {
                return res.status(404).json({ error: "Imagem não encontrada." });
            }
            res.status(500).json({ error: "Erro ao gerar a URL da imagem" });
        }
    });

module.exports = router;