var database = require("../database/config");

// KPI: Vagas por Concluintes

function buscarVagasConcluintes() {
  var instrucaoSql = `SELECT
    ano,
    qtd_vagas,
    qtd_concluintes,
    (qtd_vagas * 1.0 / NULLIF(qtd_concluintes, 0)) AS vagas_por_concluinte
FROM curso_ofertado_tb;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// KPI: Taxa de Ingressantes

function taxaIngressantes() {
  var instrucaoSql = `SELECT
    ano,
    qtd_ingressantes_rede_publica + qtd_ingressantes_rede_privada AS total_ingressantes,
    qtd_concluintes,
    ((qtd_ingressantes_rede_publica + qtd_ingressantes_rede_privada) * 1.0 / NULLIF(qtd_concluintes, 0)) AS taxa_ingressantes
FROM curso_ofertado_tb;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// KPI: Quantidade de Alunos de escolas privadas

function buscarAlunosEscolasPrivadas() {
  var instrucaoSql = `
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// KPI: Quantidade de Alunos de escolas públicas

function buscarAlunosEscolasPublicas() {
  var instrucaoSql = `
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// GRAFICO : Cursos com maior Retorno (ROI)

function buscarCursosMaiorRetorno() {
  var instrucaoSql = `SELECT
    c.nome AS curso_nome,
    AVG(de.salario_mensal) AS media_salario
FROM dados_empregabilidade_tb de
JOIN area_tb a ON a.id_area = de.fk_area
JOIN curso_tb c ON c.fk_area = a.id_area
GROUP BY c.nome
ORDER BY media_salario DESC
LIMIT 10;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// GRAFICO : Cota por Bolsista

function buscarCotaPorBolsista() {
  var instrucaoSql = `SELECT
    ano,
    qtd_concluintes,
    qtd_concluintes_rede_publica AS concluintes_bolsistas,
    (qtd_concluintes_rede_publica * 1.0 / NULLIF(qtd_concluintes, 0)) AS cota_bolsista
FROM curso_ofertado_tb;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


// SELECT - Filtro por Area

function buscarFiltroArea(area) {
  var instrucaoSql = `SELECT nome FROM area_tb ORDER BY nome;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarVagasConcluintes,
  taxaIngressantes,
  buscarAlunosEscolasPrivadas,
  buscarAlunosEscolasPublicas,
  buscarCursosMaiorRetorno,
  buscarCotaPorBolsista,
  buscarFiltroArea
};
