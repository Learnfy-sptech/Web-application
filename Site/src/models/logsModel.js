var database = require("../database/config")

function listarLogs(pagina, tamanhoPagina) {
    const offset = (pagina - 1) * tamanhoPagina;

    const instrucaoSql = `
        SELECT 
            id,
            nome_arquivo AS nomeArquivo,
            tipo_processador AS tipoProcessador,
            status,
            mensagem,
            DATE_FORMAT(data_hora, '%d/%m/%Y %H:%i:%s') AS dataHora
        FROM logs_processamento
        ORDER BY data_hora DESC
        LIMIT ${tamanhoPagina} OFFSET ${offset}
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
    listarLogs
}