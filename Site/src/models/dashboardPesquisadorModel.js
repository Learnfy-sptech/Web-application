var database = require("../database/config")

function getKpiQtdCursantes(area){

    var instrucaoSql = `
    SELECT SUM(curso_ofertado.qtd_ingressantes_rede_publica + curso_ofertado.qtd_ingressantes_rede_privada) AS totalCursantes
    FROM curso_ofertado_tb AS curso_ofertado
    JOIN curso_tb AS curso 
    ON curso.id_curso = curso_ofertado.fk_curso 
    JOIN area_tb as area ON fk_area = id_area
    WHERE area.nome = "${area}";
    `

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);

}

function getKpiPessoasTrabalhamNaArea(area){

    var instrucaoSql = `
    SELECT COUNT(empregabilidade.cbo_2002) as totalTrabalham
    FROM dados_empregabilidade_tb as empregabilidade
    JOIN area_tb as area ON fk_area = id_area
    WHERE empregabilidade.categoria REGEXP 'Empregado' and area.nome = "${area}";
    `

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiEvasaoPorModalidade(area){
    
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

    `

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getKpiMediaSalarial(area){
    var instrucaoSql = `
        SELECT 
        ROUND(AVG(empregabilidade.salario_mensal), 2) AS mediaSalarial
        FROM dados_empregabilidade_tb AS empregabilidade
        JOIN area_tb AS area ON empregabilidade.fk_area = area.id_area
        WHERE empregabilidade.categoria REGEXP 'Empregado'
        AND area.nome = "${area}";
    `

    console.log("Executando SELECT no SQL: \n " + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getGraficoInstituicoes(area){

}

function getGraficoProjecaoEvasao(area){

}
module.exports = {
    getKpiQtdCursantes,
    getKpiPessoasTrabalhamNaArea,
    getKpiEvasaoPorModalidade,
    getKpiMediaSalarial,
    getGraficoInstituicoes,
    getGraficoProjecaoEvasao
}