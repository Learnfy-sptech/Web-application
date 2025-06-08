var database = require("../database/config")

function getKpiQtdCursantes(area){

    var instrucaoSql = `
    SELECT SUM(curso_ofertado.qtd_ingressantes_rede_publica + curso_ofertado.qtd_ingressantes_rede_privada) AS total_cursantes
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
    SELECT SUM(curso_ofertado.qtd_ingressantes_rede_publica + curso_ofertado.qtd_ingressantes_rede_privada) AS total_cursantes
    FROM curso_ofertado_tb AS curso_ofertado
    JOIN curso_tb AS curso 
    ON curso.id_curso = curso_ofertado.fk_curso 
    JOIN area_tb as area ON fk_area = id_area
    WHERE area.nome = "${area}";
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
    getGraficoInstituicoes,
    getGraficoProjecaoEvasao
}