var database = require("../database/config")

function login(email, senha){
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)

  var instrucaoSql = `SELECT idUsuario, nome, email  FROM usuario WHERE email = ${email} AND senha = ${senha}`

  return database.executar(instrucaoSql)
}

function cadastrar(tipoConta, nome, email, cpf, telefone, senha){
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);

  var instrucaoSql = `INSERT INTO usuario(tipoConta, nome, email, cpf, telefone) VALUES (${tipoConta}, ${nome}, ${email}, ${cpf}, ${telefone}, ${senha})`

  return database.executar(instrucaoSql)
}

module.exports = {
    async updateProfilePhoto(userId, photoPath) {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE usuarios SET foto_perfil_path = ? WHERE id = ?',
                [photoPath, userId]
            );
        } finally {
            connection.release();
        }
    },
    
    async getProfilePhoto(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT foto_perfil_path FROM usuarios WHERE id = ?',
                [userId]
            );
            return rows[0] ? rows[0].foto_perfil_path : null;
        } finally {
            connection.release();
        }
    },

  login,
  cadastrar
}
  
