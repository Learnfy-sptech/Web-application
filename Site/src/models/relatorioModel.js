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
        SELECT * FROM relatorio_tb WHERE fk_usuario = ?
    `
    const valores = [id]
    return database.executar(instrucaoSql, valores)
}

function obterInfoRelatorio(id) {
    const instrucaoSql = `
        SELECT * FROM relatorio_tb WHERE  = ?
    `
    const valores = [id]
    return database.executar(instrucaoSql, valores)
}

function obterCidadesPorEstado(estado) {
    const instrucaoSql = `
        SELECT * FROM cidade_tb WHERE fk_uf = (SELECT id_uf FROM uf_tb WHERE nome = ?)
    `
    const valores = [estado]
    return database.executar(instrucaoSql, valores)
}

module.exports = {
    inserirRelatorio,
    obterRelatoriosPorId,
    obterInfoRelatorio,
    obterCidadesPorEstado,
}