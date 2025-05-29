var usuarioModel = require("../models/usuarioModel");

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


function login(req, res) {
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;

  if (!email) return res.status(400).send("Seu email está undefined");
  if (!senha) return res.status(400).send("Sua senha está undefined");

  usuarioModel
    .login(email, senha)
    .then(function (resposta) {
      if (resposta.length > 0) {
        res.status(200).json({
          id: resposta[0].id,
          nome: resposta[0].nome,
          email: resposta[0].email,
          tipoConta: resposta[0].tipoConta,
          foto_perfil_path: resposta[0].foto_perfil_path
        });
      } else {
        res.status(403).send("E-mail e/ou senha inválido(s)");
      }
    })

    .catch(function (erro) {
      console.error(erro);
      res.status(500).json(erro.sqlMessage);
    });
}


function atualizar(req, res) {
  const id = req.body.id;
  const nome = req.body.nome?.trim();
  const telefone = req.body.telefone?.trim();
  const senha = req.body.senha?.trim();
  const foto = req.file?.filename || null;

  if (!nome && !telefone && !senha && !foto) {
    return res.status(400).json({ erro: "Nenhum campo fornecido para atualização." });
  }

  usuarioModel
    .atualizar(id, nome, telefone, senha, foto)
    .then(() => {
      res.status(200).json({ mensagem: "Dados atualizados com sucesso." });
    })
    .catch((erro) => {
      console.error(erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}




module.exports = {
  cadastrar,
  login,
  atualizar,
};
