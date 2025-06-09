const empresaModel = require('../models/empresaModel');
const { ensureSlackChannelExists, enviarNotificacaoSlack } = require("../services/slackService");

exports.cadastrarEmpresa = async (req, res) => {
  try {
    const { nomeResponsavel, nomeEmpresa, cnpj, emailEmpresa, telefoneEmpresa } = req.body;

    if (!nomeEmpresa || !cnpj || !emailEmpresa || !telefoneEmpresa) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    const novaEmpresa = await empresaModel.cadastrarEmpresa({
      nomeEmpresa,
      cnpj,
      emailEmpresa,
      telefoneEmpresa,
    });

    console.log("[EMPRESA] Dados de empresa recebidos:", req.body);

    try {
      const slackChannelId = await ensureSlackChannelExists(nomeEmpresa);
      await empresaModel.atualizarSlackChannelId(novaEmpresa.id, slackChannelId);
    } catch (err) {
      console.error('Erro ao criar canal Slack:', err);
    }

    await enviarNotificacaoSlack(`Nova empresa cadastrada! - Seja bem vindo(a), ${nomeResponsavel} da empresa (${nomeEmpresa})`);

    res.status(201).json({ message: 'Empresa cadastrada com sucesso.', empresa: novaEmpresa });
  } catch (error) {
    console.error('Erro cadastrarEmpresa:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.validarToken = async (req, res) => {
  const token = req.query.token || req.body.token;
  console.log("[CONTROLLER] Token recebido", token);

  if (!token) {
    return res.status(400).json({ message: 'Token não informado.' });
  }

  try {
    const empresa = await empresaModel.buscarEmpresaPorToken(token);
    console.log("[CONTROLLER] Empresa encontrada:", empresa);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada para o token informado.' });
    }

    return res.status(200).json({ message: "Token válido", empresa });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return res.status(500).json({ message: 'Erro interno ao validar token.' });
  }
};

exports.removerEmpresa = async (req, res) => {
  const { cnpj } = req.body;
  try {
    await empresaModel.removerPorCnpj(cnpj);
    res.status(200).json({ mensagem: "Empresa removida com sucesso" });
  } catch (erro) {
    console.error("Erro ao remover empresa:", erro);
    res.status(500).json({ erro: "Erro ao remover empresa" });
  }
};

exports.atualizarConfigurações = async (req, res) => {
  const idEmpresa = req.params.idEmpresa;
  const { receber_notificacao_global } = req.body;

  try {
    await empresaModel.alterarStatusNotificacoes(idEmpresa, receber_notificacao_global);
    res.status(200).send("Configuração atualizada com sucesso");
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

exports.receberDadosNotificacao = async (req, res) => {
  const idEmpresa = req.params.idEmpresa;

  try {
    const dados = await empresaModel.dadosNotificacao(idEmpresa);
    res.status(200).json(dados[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}



