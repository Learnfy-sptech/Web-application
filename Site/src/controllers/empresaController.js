const empresaModel = require('../models/empresaModel');

exports.cadastrarEmpresa = async (req, res) => {
  try {
    const { nomeEmpresa, cnpj, emailEmpresa, telefoneEmpresa } = req.body;

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

