var database = require("../database/config");


function getKpiQtdCursantes(area) {
    var instrucaoSql = `
    SELECT SUM(curso_ofertado.qtd_ingressantes_rede_publica + curso_ofertado.qtd_ingressantes_rede_privada) AS totalCursantes
    FROM curso_ofertado_tb AS curso_ofertado
    JOIN curso_tb AS curso 
    ON curso.id_curso = curso_ofertado.fk_curso 
    JOIN area_tb as area ON fk_area = id_area
    WHERE area.nome = "${area}";
    `;

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiPessoasTrabalhamNaArea(area) {
    var instrucaoSql = `
    SELECT COUNT(empregabilidade.cbo_2002) as totalTrabalham
    FROM dados_empregabilidade_tb as empregabilidade
    JOIN area_tb as area ON fk_area = id_area
    WHERE empregabilidade.categoria REGEXP 'Empregado' and area.nome = "${area}";
    `;

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiEvasaoPorModalidade(area) {
    var instrucaoSql = `
    SELECT 
    ABS(SUM(
    CASE 
      WHEN (curso_ofertado.qtd_incritos - curso_ofertado.qtd_concluintes) < 0 
      THEN (curso_ofertado.qtd_incritos - curso_ofertado.qtd_concluintes)
      ELSE 0 
    END
))AS qtdEvasao
    FROM curso_ofertado_tb AS curso_ofertado
    JOIN curso_tb AS curso ON curso_ofertado.fk_curso = curso.id_curso
    JOIN area_tb AS area ON curso.fk_area = area.id_area
    WHERE area.nome = "${area}";

    `;

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiMediaSalarial(area) {
    var instrucaoSql = `
        SELECT 
        ROUND(AVG(empregabilidade.salario_mensal), 2) AS mediaSalarial
        FROM dados_empregabilidade_tb AS empregabilidade
        JOIN area_tb AS area ON empregabilidade.fk_area = area.id_area
        WHERE empregabilidade.categoria REGEXP 'Empregado'
        AND area.nome = "${area}";
    `;

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}



function getGraficoInstituicoes(){
    var instrucaoSql = `    SELECT 
    ano,
    SUM(qtd_ingressantes_rede_publica) AS ingressantes_publica,
    SUM(qtd_ingressantes_rede_privada) AS ingressantes_privada
FROM 
    curso_ofertado_tb
WHERE 
    ano IN (2021, 2022, 2023)
GROUP BY 
    ano
ORDER BY 
    ano;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
 }


function getGraficoProjecaoEvasao() {
    var instrucaoSql = `
 SELECT 
    ano,
    SUM(qtd_incritos) AS total_ingressantes,
    SUM(qtd_concluintes) AS total_concluintes,
    (SUM(qtd_incritos) - SUM(qtd_concluintes)) AS evasao_estimativa
FROM curso_ofertado_tb
WHERE ano IS NOT NULL
GROUP BY ano

UNION ALL

SELECT
    2024 AS ano,
    NULL AS total_ingressantes,
    NULL AS total_concluintes,
    ROUND(
        -- evasao do último ano * (1 + media crescimento)
        (SELECT (SUM(qtd_incritos) - SUM(qtd_concluintes)) 
         FROM curso_ofertado_tb 
         WHERE ano = (
             SELECT MAX(ano) FROM curso_ofertado_tb WHERE ano IS NOT NULL
         )
        )
        *
        (1 + COALESCE(
            (
                SELECT AVG(crescimento) FROM (
                    SELECT 
                        (CAST(curr.evasao AS DECIMAL(10,2)) / prev.evasao) - 1 AS crescimento
                    FROM (
                        SELECT ano, SUM(qtd_incritos) - SUM(qtd_concluintes) AS evasao
                        FROM curso_ofertado_tb
                        WHERE ano IS NOT NULL
                        GROUP BY ano
                    ) curr
                    JOIN (
                        SELECT ano, SUM(qtd_incritos) - SUM(qtd_concluintes) AS evasao
                        FROM curso_ofertado_tb
                        WHERE ano IS NOT NULL
                        GROUP BY ano
                    ) prev ON curr.ano = prev.ano + 1
                    WHERE prev.evasao <> 0
                ) AS crescimento_anos
            ), 0
        ))
    ) AS evasao_estimativa
;
    `;
    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getGraficoProjecaoEvasao,
    getKpiQtdCursantes,
    getKpiPessoasTrabalhamNaArea,
    getKpiEvasaoPorModalidade,
    getKpiMediaSalarial,
    getGraficoInstituicoes,
    getGraficoProjecaoEvasao,
};
