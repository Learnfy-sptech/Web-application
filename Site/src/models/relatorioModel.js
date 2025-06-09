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

function buscarDadosRelatorio(idRelatorio) {
    const instrucaoSqlInfo = `
        SELECT colunas, filtros FROM relatorio_tb WHERE id_relatorio = ${idRelatorio};
    `;

    return database.executar(instrucaoSqlInfo)
        .then(resultado => {
            if (resultado.length === 0) {
                throw new Error('Relatório não encontrado');
            }

            const config = resultado[0];
            
            // Parse seguro dos JSONs
            let colunas, filtros;
            try {
                colunas = typeof config.colunas === 'string' ? JSON.parse(config.colunas) : config.colunas;
                filtros = typeof config.filtros === 'string' ? JSON.parse(config.filtros) : config.filtros;
            } catch (e) {
                console.error('Erro ao parsear JSON:', e);
                throw new Error('Formato inválido para colunas ou filtros');
            }

            // Constrói a query dinâmica completa
            const queryCompleta = construirQueryDinamica(colunas, filtros);
            console.log('Query gerada:', queryCompleta); // Para debug

            // Executa a query principal
            return database.executar(queryCompleta);
        });
}

function construirQueryDinamica(colunas, filtros) {
    // Mapeamento das colunas solicitadas para os campos reais no banco
    const mapeamentoColunas = {
        'instituicao_de_ensino': 'ies.nome AS instituicao_de_ensino',
        'curso': 'c.nome AS curso',
        'modalidade_ensino': 'curso_ofertado_tb.modalidade_ensino',
        'ano': 'curso_ofertado_tb.ano',
        'qtd_vagas': 'qtd_vagas',
        'qtd_vagas_diurno': 'qtd_vagas_diurno',
        'qtd_vagas_noturno': 'qtd_vagas_noturno',
        'qtd_vagas_ead': 'qtd_vagas_ead',
        'qtd_incritos': 'qtd_incritos',
        'qtd_incritos_diurno': 'qtd_incritos_diurno',
        'qtd_incritos_noturno': 'qtd_incritos_noturno',
        'qtd_incritos_ead': 'qtd_incritos_ead',
        'qtd_concluintes': 'qtd_concluintes',
        'qtd_concluintes_diurno': 'qtd_concluintes_diurno',
        'qtd_concluintes_noturno': 'qtd_concluintes_noturno',
        'qtd_ingressantes_rede_publica': 'qtd_ingressantes_rede_publica',
        'qtd_ingressantes_rede_privada': 'qtd_ingressantes_rede_privada',
        'qtd_concluintes_rede_publica': 'qtd_concluintes_rede_publica',
        'qtd_concluintes_rede_privada': 'qtd_concluintes_rede_privada'
    };

    // Mapeamento de filtros para colunas na tabela
    const mapeamentoFiltros = {
        'curso': 'c.nome',
        'cidade': 'm.nome',
        'estado': 'uf.sigla',
        'especializacao': 'a.nome',
        'ano': 'curso_ofertado_tb.ano'
    };

    // Seleciona apenas as colunas válidas e mapeadas
    const colunasSelect = colunas
        .filter(col => mapeamentoColunas[col])
        .map(col => mapeamentoColunas[col]);

    if (colunasSelect.length === 0) {
        throw new Error('Nenhuma coluna válida selecionada');
    }

    const whereClauses = [];
    let joins = '';

    // JOINs obrigatórios para as colunas selecionadas
    if (colunas.includes('instituicao_de_ensino')) {
        joins += ' JOIN ies_tb ies ON ies.id_ies = curso_ofertado_tb.fk_ies';
    }
    if (colunas.includes('curso') || filtros.curso) {
        joins += ' JOIN curso_tb c ON c.id_curso = curso_ofertado_tb.fk_curso';
    }
    if (filtros.especializacao) {
        joins += ' JOIN area_tb a ON a.id_area = c.fk_area';
    }
    if ((filtros.estado || filtros.cidade) && colunas.includes('instituicao_de_ensino')) {
        joins += ' JOIN municipio_tb m ON m.id_municipio = ies.fk_municipio';
        joins += ' JOIN uf_tb uf ON uf.id_uf = m.fk_uf';
    } else if ((filtros.estado || filtros.cidade) && !colunas.includes('instituicao_de_ensino')) {
        joins += ' JOIN ies_tb ies ON ies.id_ies = curso_ofertado_tb.fk_ies';
        joins += ' JOIN municipio_tb m ON m.id_municipio = ies.fk_municipio';
        joins += ' JOIN uf_tb uf ON uf.id_uf = m.fk_uf';
    }

    for (const [filtro, valor] of Object.entries(filtros)) {
        if (valor && mapeamentoFiltros[filtro]) {
            const valorFormatado = typeof valor === 'string' ? `'${valor.replace(/'/g, "''")}'` : valor;
            whereClauses.push(`${mapeamentoFiltros[filtro]} = ${valorFormatado}`);
        }
    }

    const whereClause = whereClauses.length > 0
        ? `WHERE ${whereClauses.join(' AND ')}`
        : '';

    return `
        SELECT ${colunasSelect.join(', ')} 
        FROM curso_ofertado_tb
        ${joins}
        ${whereClause}
    `;
}

module.exports = {
    inserirRelatorio,
    obterRelatoriosPorId,
    obterInfoRelatorio,
    obterCidadesPorEstado,
    deletarRelatorioPorId,
    atualizarRelatorio,
    obterCursosPorEspecializacao,
    buscarDadosRelatorio
}
