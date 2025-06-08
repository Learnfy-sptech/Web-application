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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

function executar(instrucao, params) {
    return new Promise(function (resolve, reject) {
        if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
            // SQL Server
            sql.connect(sqlServerConfig).then(function () {
                if (params && params.length > 0) {
                    return sql.query(instrucao, params);
                } else {
                    return sql.query(instrucao);
                }
            }).then(function (resultados) {
                resolve(resultados.recordset);
            }).catch(function (erro) {
                reject(erro);
            });
            sql.on('error', function (erro) {
                console.error("ERRO NO SQL SERVER (Azure):", erro);
            });
        } else if (process.env.AMBIENTE_PROCESSO == "producao") {
            // MySQL
            var conexao = mysql.createConnection(mysqlConfig);
            conexao.connect(function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                if (params && params.length > 0) {
                    conexao.query(instrucao, params, function (erro, resultados) {
                        conexao.end();
                        if (erro) {
                            reject(erro);
                            return;
                        }
                        resolve(resultados);
                    });
                } else {
                    conexao.query(instrucao, function (erro, resultados) {
                        conexao.end();
                        if (erro) {
                            reject(erro);
                            return;
                        }
                        resolve(resultados);
                    });
                }
            });
            conexao.on('error', function (erro) {
                console.error("ERRO NO MySQL:", erro.sqlMessage);
            });
        } else {
            reject("AMBIENTE NÃO CONFIGURADO EM app.js");
        }
    });
}


module.exports = {
    executar
};