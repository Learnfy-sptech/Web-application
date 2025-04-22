var database = require("../database/config")

function login(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)

    var instrucaoSql = `SELECT idUsuario, nome, email  FROM usuario WHERE email = ${email} AND senha = ${senha}`

    return database.executar(instrucaoSql)
}

function cadastrar(email, senha, tipoConta, nome, cpf, telefone) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);

    var instrucaoSql = `INSERT INTO usuario(tipoConta, nome, email, cpf, telefone) VALUES (${tipoConta}, ${nome}, ${email}, ${cpf}, ${telefone}, ${senha})`

    return database.executar(instrucaoSql)
}

async function updateProfilePhoto(userId, photoPath) {
    const instrucaoSql = `
        UPDATE usuario 
        SET foto_perfil_path = '${photoPath}' 
        WHERE id = ${userId}
    `;
    return database.executar(instrucaoSql);
}

async function getProfilePhoto(userId) {
    const instrucaoSql = `
        SELECT foto_perfil_path 
        FROM usuario 
        WHERE id = ${userId}
    `;
    const resultado = await database.executar(instrucaoSql);
    return resultado[0]?.foto_perfil_path || null;
}

module.exports = {
    login,
    cadastrar,
    updateProfilePhoto,
    getProfilePhoto
};

