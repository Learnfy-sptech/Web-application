var database = require("../database/config");

async function cadastrar({ nome, email, cpf, telefone, senha, tipoConta, token }) {
  let idEmpresa = null;

  if (token) {
    const empresa = await buscarEmpresaPorToken(token); 
    if (!empresa) {
      throw new Error("Token inválido ou empresa não encontrada.");
    }
    idEmpresa = empresa.id;
  }

  if ([nome, email, cpf, telefone, senha].some(v => typeof v !== 'string')) {
    throw new Error("Dados inválidos.");
  }

  const instrucaoSQL = `
    INSERT INTO usuario (nome, email, cpf, telefone, senha, tipo_conta, fk_empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  await database.executar(instrucaoSQL, [nome, email, cpf, telefone, senha, tipoConta, idEmpresa]);
}

async function buscarEmpresaPorToken(token) {
  try {
    const instrucao = `
      SELECT * FROM empresa
      WHERE token_acesso = ?;
    `;
    const resultado = await database.executar(instrucao, [token]);

    if (resultado.length > 0) {
      return resultado[0]; 
    } else {
      return null;
    }
  } catch (erro) {
    console.error("Erro ao buscar empresa por token:", erro);
    throw erro;
  }
}

async function verificarUsuarioExistente(cpf, email) {
  const instrucao = `
    SELECT * FROM usuario WHERE cpf = ? OR email = ?;
  `;
  const resultado = await database.executar(instrucao, [cpf, email]);
  return resultado.length > 0;
}

async function cadastrarUsuario(nome, email, cpf, telefone, senha, tipoConta, idEmpresa = null) {
  const instrucao = `
    INSERT INTO usuario (nome, email, cpf, telefone, senha, tipo_conta, fk_empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  return await database.executar(instrucao, [nome, email, cpf, telefone, senha, tipoConta, idEmpresa]);
}


function login(email, senha) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    email,
    senha
  );

  var instrucaoSql = `
  SELECT id, nome, email, tipoConta, telefone, foto_perfil_path
  FROM usuario 
  WHERE email = '${email}' AND senha = '${senha}'
`;

  return database.executar(instrucaoSql);
}


function atualizar(id, nome, telefone, senha, foto) {
  const campos = [];
  const valores = [];

  if (nome) {
    campos.push("nome = ?");
    valores.push(nome);
  }
  if (telefone) {
    campos.push("telefone = ?");
    valores.push(telefone);
  }
  if (senha) {
    campos.push("senha = ?");
    valores.push(senha);
  }
  if (foto) {
    campos.push("foto_perfil_path = ?");
    valores.push(foto);
  }

  if (campos.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  const instrucaoSql = `UPDATE usuario SET ${campos.join(", ")} WHERE id = ?`;
  valores.push(id);

  return database.executar(instrucaoSql, valores);
}

module.exports = {
  cadastrar,
  login,
  atualizar,
  verificarUsuarioExistente,
  cadastrarUsuario
};
