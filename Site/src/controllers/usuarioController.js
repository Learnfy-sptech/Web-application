const usuarioModel = require("../models/usuarioModel");
const slackService = require("../services/slackService");

async function cadastrar(req, res) {
  const { email, senha, nome, cpf, telefone, token, tipoConta } = req.body;

  console.log("[USUARIO] Dados de usuário recebidos:", req.body);

  if (!email) {
    return res.status(400).json({ erro: "Seu email está undefined" });
  }

  try {
    const existe = await usuarioModel.verificarUsuarioExistente(cpf, email);

    if (existe) {
      return res.status(409).json({ message: "Usuário com este CPF ou e-mail já existe" });
    }

    const resultado = await usuarioModel.cadastrar({ nome, email, cpf, telefone, senha, tipoConta, token });

    return res.status(200).json({ mensagem: "Usuário criado com sucesso", dados: resultado });

  } catch (erro) {
    console.error("[USUARIO] Erro ao cadastrar:", erro);
    return res.status(500).json({ erro: erro.sqlMessage || erro.message || "Erro no servidor" });
  }
}


function login(req, res) {
  var email = req.body.emailVar;
  var senha = req.body.senhaVar;

  if (!email) return res.status(400).json({ erro: "Seu email está undefined" });
  if (!senha) return res.status(400).json({ erro: "Sua senha está undefined" });

  usuarioModel
    .login(email, senha)
    .then(function (resposta) {

      console.log("Resultado da consulta:", resposta);

      if (resposta.length > 0) {
        return res.status(200).json({
          id: resposta[0].id,
          nome: resposta[0].nome,
          email: resposta[0].email,
          tipo_conta: resposta[0].tipo_conta,
          telefone: resposta[0].telefone,
          foto_perfil_path: resposta[0].foto_perfil_path,
          slack_channel_id: resposta[0].slack_channel_id,
          idEmpresa: resposta[0].idEmpresa,
        });
      } else {
        return res.status(403).json({ erro: "E-mail e/ou senha inválido(s)" });
      }
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).json({ erro: erro.sqlMessage || "Erro no servidor" });
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

async function recuperarFuncionarios(req, res) {
  const idEmpresa = req.params.idEmpresa;

  try {
    const resposta = await usuarioModel.recuperarFuncionarios(idEmpresa);

    if (resposta && resposta.length > 0) {
      return res.status(200).json(resposta);
    } else {
      return res.status(404).json({ erro: "Nenhum funcionário encontrado" });
    }
  } catch (error) {
    console.error("Erro ao recuperar funcionários:", error);
    return res.status(500).json({ erro: "Erro ao buscar funcionários" });
  }
}


module.exports = {
  cadastrar,
  login,
  atualizar,
  recuperarFuncionarios
};
