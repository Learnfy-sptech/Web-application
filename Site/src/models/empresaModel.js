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
  return empresa;
}

async function removerPorCnpj(cnpj) {
  const instrucao = `
    DELETE FROM empresa WHERE cnpj = ?;
  `;
  await database.executar(instrucao, [cnpj]);
}

module.exports = {
  buscarEmpresaPorToken,
  cadastrarEmpresa,
  removerPorCnpj
};
