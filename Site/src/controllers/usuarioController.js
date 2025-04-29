var usuarioModel = require("../models/usuarioModel");

function login(req, res) {
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;

  if (email == undefined) {
    res.status(400).send("Seu email está undefined");
  }
  if (senha == undefined) {
    res.status(400).send("Sua senha está undefined");
  }

  usuarioModel
    .login(email, senha)
    .then(function (resposta) {
      res.json(resposta);
      res.status(200).send("Usuario Logado");
    })
    .catch(function (erro) {
      res.status(500).json(erro.sqlMessage);
    });
}

function cadastrar(req, res) {
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;
  var tipoConta = req.body.tipoContaVar;
  var nome = req.body.nomeVar;
  var cpf = req.body.cpfVar;
  var telefone = req.body.telefoneVar;

  console.log("[CADASTRAR] Dados recebidos:", req.body); // Verifica todos os dados recebidos

  if (email == undefined) {
    res.status(400).send("Seu email está undefined");
  }

  usuarioModel
    .cadastrar(email, senha, tipoConta, nome, cpf, telefone)
    .then(function (resposta) {
      res.json(resposta);
      res.status(200).send("Usuario criado");
    })
    .catch(function (erro) {
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  login,
  cadastrar,
};
