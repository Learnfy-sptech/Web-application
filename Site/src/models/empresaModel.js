const database = require("../database/config");
const crypto = require("crypto");

function gerarTokenUnico() {
  return crypto.randomBytes(16).toString('hex');
}

async function buscarEmpresaPorToken(token) {
  const instrucao = `SELECT * FROM empresa WHERE token_acesso = ?`;
  const resultado = await database.executar(instrucao, [token]);
  return resultado.length > 0 ? resultado[0] : null;
}

async function cadastrarEmpresa({ nomeEmpresa, cnpj, emailEmpresa, telefoneEmpresa, tokens }) {
  const token = tokens?.token_acesso || gerarTokenUnico();
  const instrucao = `
    INSERT INTO empresa (nomeEmpresa, cnpj, emailEmpresa, telefoneEmpresa, token_acesso)
    VALUES (?, ?, ?, ?, ?);
  `;
  await database.executar(instrucao, [nomeEmpresa, cnpj, emailEmpresa, telefoneEmpresa, token]);

  const [empresa] = await database.executar(`SELECT * FROM empresa WHERE token_acesso = ?`, [token]);

  await gerarConfiguracoesNotificacao(empresa.id);
  return empresa;
}

async function gerarConfiguracoesNotificacao(idEmpresa) {
  const instrucao = `
    INSERT INTO configuracao_notificacao (fk_empresa, receber_notificacao_global)
    VALUES (?, ?);
  `;
  await database.executar(instrucao, [idEmpresa, true]);
}

async function removerPorCnpj(cnpj) {
  const instrucao = `
    DELETE FROM empresa WHERE cnpj = ?;
  `;
  await database.executar(instrucao, [cnpj]);
}

async function atualizarSlackChannelId(empresaId, slackChannelId) {
  const instrucao = `
    UPDATE empresa
    SET slack_channel_id = ?
    WHERE id = ?;
  `;

  await database.executar(instrucao, [slackChannelId, empresaId]);
}

async function alterarStatusNotificacoes(idEmpresa, receber_notificacao_global) {
  const instrucao = `
  UPDATE configuracao_notificacao
  SET receber_notificacao_global = ?
  WHERE fk_empresa = ?;
`;
  await database.executar(instrucao, [receber_notificacao_global, idEmpresa]);
}

async function dadosNotificacao(idEmpresa) {
  const instrucao = `
    SELECT * FROM configuracao_notificacao WHERE fk_empresa = ?;
  `;
  return await database.executar(instrucao, [idEmpresa]);
}


module.exports = {
  buscarEmpresaPorToken,
  cadastrarEmpresa,
  removerPorCnpj,
  atualizarSlackChannelId,
  alterarStatusNotificacoes,
  dadosNotificacao
};
