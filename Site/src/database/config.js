var mysql = require("mysql2"); // Para MySQL
var sql = require('mssql'); // Para SQL Server
require('dotenv').config(); // Carregar variáveis de ambiente

// CONEXÃO DO SQL SERVER - AZURE (NUVEM)
var sqlServerConfig = {
    server: process.env.DB_HOST, // Host para o SQL Server
    database: process.env.DB_DATABASE, // Nome do banco de dados
    user: process.env.DB_USER, // Usuário
    password: process.env.DB_PASSWORD, // Senha
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // Configuração para conexão segura com o Azure
    }
};

// CONEXÃO DO MYSQL
const mysqlConfig = {
    host: process.env.DB_HOST, // Host do MySQL
    user: process.env.DB_USER, // Usuário
    password: process.env.DB_PASSWORD, // Senha
    database: process.env.DB_NAME, // Nome do banco de dados
    port: process.env.DB_PORT || 3306 // Porta do MySQL (padrão 3306)
};

function executar(instrucao) {
    return new Promise(function (resolve, reject) {
        if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
            // Conexão com o SQL Server (produção)
            sql.connect(sqlServerConfig).then(function () {
                return sql.query(instrucao); // Executa a consulta no SQL Server
            }).then(function (resultados) {
                console.log(resultados); // Log dos resultados
                resolve(resultados.recordset); // Resolve com os resultados
            }).catch(function (erro) {
                reject(erro); // Rejeita em caso de erro
                console.log('ERRO: ', erro);
            });
            sql.on('error', function (erro) {
                console.error("ERRO NO SQL SERVER (Azure):", erro);
            });
        } else if (process.env.AMBIENTE_PROCESSO == "producao") {
            // Conexão com o MySQL (desenvolvimento)
            var conexao = mysql.createConnection(mysqlConfig);
            conexao.connect(function (err) {
                if (err) {
                    reject(err); // Rejeita em caso de erro
                }
                conexao.query(instrucao, function (erro, resultados) {
                    conexao.end(); // Fecha a conexão
                    if (erro) {
                        reject(erro); // Rejeita em caso de erro na query
                    }
                    console.log(resultados); // Log dos resultados
                    resolve(resultados); // Resolve com os resultados
                });
            });
            conexao.on('error', function (erro) {
                console.error("ERRO NO MySQL:", erro.sqlMessage); // Log de erro no MySQL
            });
        } else {
            // Se o ambiente não estiver configurado corretamente
            console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
            reject("AMBIENTE NÃO CONFIGURADO EM app.js");
        }
    });
}

module.exports = {
    executar
};