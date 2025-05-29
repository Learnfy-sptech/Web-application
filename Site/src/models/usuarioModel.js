var database = require("../database/config");

function cadastrar(email, senha, tipoConta, nome, cpf, telefone) {
  console.log("Dados recebidos:", tipoConta, nome, email, cpf, telefone, senha);

  var instrucaoSql = `INSERT INTO usuario(tipoConta, nome, email, cpf, telefone, senha) VALUES ('${tipoConta}', '${nome}', '${email}', '${cpf}', '${telefone}', '${senha}')`;

  console.log("Consulta SQL gerada:", instrucaoSql);

  return database.executar(instrucaoSql);
}


function login(email, senha) {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ",
    email,
    senha
  );

  var instrucaoSql = `
  SELECT id, nome, email, tipoConta, foto_perfil_path
  FROM usuario 
  WHERE email = '${email}' AND senha = '${senha}'
`;

  return database.executar(instrucaoSql);
}


function atualizar(id, nome, telefone, senha, foto) {
  console.log("Atualizando usuário id:", id);

  let campos = [];

  if (nome) campos.push(`nome = '${nome}'`);
  if (telefone) campos.push(`telefone = '${telefone}'`);
  if (senha) campos.push(`senha = '${senha}'`);
  if (foto) campos.push(`foto_perfil_path = '${foto}'`);

  if (campos.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  const instrucaoSql = `UPDATE usuario SET ${campos.join(", ")} WHERE id = '${id}'`;

  console.log("SQL atualizar usuário:", instrucaoSql);
  return database.executar(instrucaoSql);
}



module.exports = {
  cadastrar,
  login,
  atualizar,
};
