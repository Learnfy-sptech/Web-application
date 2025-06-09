var database = require("../database/config")

function inserirRelatorio(nome, fkUsuario, colunas, filtros) {
    console.log('Dados recebidos:', nome, fkUsuario, colunas, filtros);

    const instrucaoSql = `
        INSERT INTO relatorio_tb (nome, colunas, filtros, fk_usuario) 
        VALUES ('${nome}', '${JSON.stringify(colunas)}', '${JSON.stringify(filtros)}', ${fkUsuario});
    `
    return database.executar(instrucaoSql)
}

function obterRelatoriosPorId(id) {
    const instrucaoSql = `
        SELECT * FROM relatorio_tb WHERE fk_usuario = ${id};
    `
    return database.executar(instrucaoSql)
}

function obterInfoRelatorio(id) {
    const instrucaoSql = `
        SELECT * FROM relatorio_tb WHERE id_relatorio = ${id};
    `
    return database.executar(instrucaoSql)
}

function obterCidadesPorEstado(estado) {
    const instrucaoSql = `
        SELECT nome FROM municipio_tb WHERE fk_uf = (SELECT id_uf FROM uf_tb WHERE sigla = '${estado}') ORDER BY nome;
    `
    return database.executar(instrucaoSql)
}

function deletarRelatorioPorId(id) {
    const instrucaoSql = `
        DELETE FROM relatorio_tb WHERE id_relatorio = ${id};
    `
    return database.executar(instrucaoSql)
}

function atualizarRelatorio(id, nome, colunas, filtros) {
    const instrucaoSql = `
        UPDATE relatorio_tb SET nome = '${nome}', colunas = '${JSON.stringify(colunas)}', filtros = '${JSON.stringify(filtros)}'
        WHERE id_relatorio = ${id};
    `
    return database.executar(instrucaoSql)
}

function obterCursosPorEspecializacao(especializacao) {
    const instrucaoSql = `
        SELECT nome FROM curso_tb WHERE fk_area = (SELECT id_area FROM area_tb WHERE nome = '${especializacao}') ORDER BY nome;
    `
    return database.executar(instrucaoSql)
}

module.exports = {
    inserirRelatorio,
    obterRelatoriosPorId,
    obterInfoRelatorio,
    obterCidadesPorEstado,
    deletarRelatorioPorId,
    atualizarRelatorio,
    obterCursosPorEspecializacao
}
