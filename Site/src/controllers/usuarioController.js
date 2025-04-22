var usuarioModel = require("../models/usuarioModel");
const multer = require('multer');
const path = require('path');

function login(req, res){
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;
  if (email === undefined) {
    res.status(400).send("Seu email está undefined!");
  } else if (senha === undefined) {
    res.status(400).send("Sua senha está indefinida!");
  } else { 
    usuarioModel.login(email, senha)
    .then(function(resultado) {
      if (resultado.length === 1) {
        res.status(200).json(resultado[0]);
      } else if (resultado.length === 0) {
        res.status(403).send("Email e/ou senha inválido(s)");
      } else {
        res.status(403).send("Mais de um usuário com essas credenciais!");
      }
    }).catch(function(erro){
      res.status(500).json(erro.sqlMessage);
    });
  }
}

function cadastrar(req, res){
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;
  var tipoConta = req.body.tipoContaVar;
  var nome = req.body.nomeVar; 
  var cpf = req.body.cpfVar;
  var telefone = req.body.telefoneVar;

  console.log('[CADASTRAR] Dados recebidos:', { email, senha, tipoConta, nome, cpf, telefone });

  if(email == undefined){
    res.status(400).send("Seu email está undefined");
  }

  usuarioModel.cadastrar(email, senha, tipoConta, nome, cpf, telefone)
    .then(function(resposta){
      res.json(resposta);
      res.status(200).send("Usuario criado");
    })
    .catch(function(erro){
      res.status(500).json(erro.sqlMessage);
    });
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif)'));
    }
}).single('foto');

// Middleware para upload
const uploadProfilePhoto = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
        
        try {
            await usuarioModel.updateProfilePhoto(req.user.id, req.file.path);
            res.json({ 
                success: true,
                message: 'Foto atualizada com sucesso',
                photoPath: `/uploads/${req.file.filename}`
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao salvar foto no banco' });
        }
    });
};

// Obter foto de perfil
const getProfilePhoto = async (req, res) => {
    try {
        const photoPath = await usuarioModel.getProfilePhoto(req.params.userId);
        
        if (!photoPath) {
            return res.status(404).json({ error: 'Foto não encontrada' });
        }
        
        res.sendFile(path.resolve(photoPath));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao recuperar foto' });
    }
};

module.exports = {
  login,
  cadastrar,
  uploadProfilePhoto,
  getProfilePhoto
};
