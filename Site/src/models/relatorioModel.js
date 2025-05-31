var database = require("../database/config")

function inserirRelatorio(nome, fkUsuario, colunas, filtros) {
    const instrucaoSql = `
        INSERT INTO relatorio (nome, colunas, filtros, dt_criacao, fk_usuario) 
        VALUES (?, ?, ?, NOW(), ?);
    `

    const valores = [
        nome,
        JSON.stringify(colunas),
        JSON.stringify(filtros),
        fkUsuario
    ]

    return database.executar(instrucaoSql, valores)
}

function obterRelatoriosPorId(id) {
    const instrucaoSql = `
        SELECT * FROM relatorio_tb where fk_usuario = ?
    `
    const valores = [id]
    return database.executar(instrucaoSql, valores)
}

function obterInfoRelatorio(id) {
    const instrucaoSql = `
        SELECT * FROM relatorio_tb where  = ?
    `
    const valores = [id]
    return database.executar(instrucaoSql, valores)
}

module.exports = {
    inserirRelatorio,
    obterRelatoriosPorId,
    obterInfoRelatorio,
}