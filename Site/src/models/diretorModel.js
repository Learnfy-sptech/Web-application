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

function totalIngressantes() {
  var instrucaoSql = `SELECT 
  SUM(qtd_ingressantes_rede_publica + qtd_ingressantes_rede_privada) AS total_ingressantes
FROM curso_ofertado_tb
WHERE ano = 2023;

`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// KPI: Quantidade de Alunos de escolas privadas

function buscarAlunosEscolasPrivadas() {
  var instrucaoSql = `SELECT
  ano,
  SUM(qtd_ingressantes_rede_privada) AS total_privada
FROM curso_ofertado_tb WHERE ano = 2023;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// KPI: Quantidade de Alunos de escolas públicas

function buscarAlunosEscolasPublicas() {
  var instrucaoSql = `SELECT
  ano,
  SUM(qtd_ingressantes_rede_publica) AS total_publica
FROM curso_ofertado_tb
WHERE ano = 2023;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// GRAFICO : Area com maior Retorno (ROI)

function buscarAreaMaiorRetorno() {
  var instrucaoSql = `SELECT
  a.nome AS area_nome,
  AVG(de.salario_mensal) AS media_salario
FROM dados_empregabilidade_tb de
JOIN area_tb a ON a.id_area = de.fk_area
GROUP BY a.nome
ORDER BY media_salario DESC
LIMIT 10;
;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// GRAFICO : Cota por Bolsista

function buscarBolsistaArea() {
  var instrucaoSql = `SELECT
  a.nome AS nome_area,
  SUM(co.qtd_concluintes_rede_publica) AS bolsistas,
  SUM(co.qtd_concluintes_rede_privada) AS nao_bolsistas,
  SUM(co.qtd_concluintes_rede_publica + co.qtd_concluintes_rede_privada) AS total_concluintes,
  ROUND(
    (SUM(co.qtd_concluintes_rede_publica) * 100.0) /
    NULLIF(SUM(co.qtd_concluintes_rede_publica + co.qtd_concluintes_rede_privada), 0),
    2
  ) AS percentual_bolsistas
FROM curso_ofertado_tb co
JOIN curso_tb c ON co.fk_curso = c.id_curso
JOIN area_tb a ON c.fk_area = a.id_area
GROUP BY a.nome
ORDER BY percentual_bolsistas DESC LIMIT 5;
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
  totalIngressantes,
  buscarAlunosEscolasPrivadas,
  buscarAlunosEscolasPublicas,
  buscarAreaMaiorRetorno,
  buscarBolsistaArea,
  buscarFiltroArea
};
