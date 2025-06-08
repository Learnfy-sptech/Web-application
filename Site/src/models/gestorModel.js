var database = require("../database/config");


// KPI - Empregabilidade pro Area

function empregabilidadePorArea(area) {
  var instrucaoSql = `
    SELECT 
        area.nome AS nomeArea,
        COUNT(empregabilidade.cbo_2002) AS totalTrabalham
    FROM 
        dados_empregabilidade_tb AS empregabilidade
    JOIN 
        area_tb AS area ON empregabilidade.fk_area = area.id_area
    WHERE 
        empregabilidade.categoria REGEXP 'Empregado'
        AND area.nome = '${area}';
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


function carregarRetencaoAlunos(area){

  var instrucaoSql = `
 SELECT 
    periodo,
    total_retidos
FROM (
    SELECT 'Diurno' AS periodo, 
           SUM(GREATEST(c.qtd_incritos_diurno - c.qtd_concluintes_diurno, 0)) AS total_retidos
    FROM curso_ofertado_tb c
    JOIN curso_tb ct ON c.fk_curso = ct.id_curso
    JOIN area_tb a ON ct.fk_area = a.id_area
    WHERE a.nome = "${area}" AND c.ano = 2023

    UNION

    SELECT 'Noturno',
           SUM(GREATEST(c.qtd_incritos_noturno - c.qtd_concluintes_noturno, 0))
    FROM curso_ofertado_tb c
    JOIN curso_tb ct ON c.fk_curso = ct.id_curso
    JOIN area_tb a ON ct.fk_area = a.id_area
    WHERE a.nome = "${area}" AND c.ano = 2023

    UNION

    SELECT 'EAD',
           SUM(
             GREATEST(
               c.qtd_incritos_ead
               - LEAST(
                   (c.qtd_concluintes - (c.qtd_concluintes_diurno + c.qtd_concluintes_noturno)),
                   c.qtd_incritos_ead
                 ),
               0
             )
           )
    FROM curso_ofertado_tb c
    JOIN curso_tb ct ON c.fk_curso = ct.id_curso
    JOIN area_tb a ON ct.fk_area = a.id_area
    WHERE a.nome = "${area}" AND c.ano = 2023
) AS totais
ORDER BY total_retidos DESC;

  `
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}
// KPI - Oferta Cursos

function carregarKpiOfertaCursos(area) {
  var instrucaoSql = `SELECT 
    ano,
    SUM(qtd_vagas_diurno) AS total_diurno,
    SUM(qtd_vagas_noturno) AS total_noturno,
    SUM(qtd_vagas_ead) AS total_ead
FROM 
    curso_ofertado_tb
    JOIN curso_tb ON fk_curso = id_curso
    JOIN area_tb AS area on fk_area = id_area
    WHERE 
    ano IS NOT NULL AND ano >= 2023 AND area.nome = "${area}"
GROUP BY 
    ano
ORDER BY 
    ano;

`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


// KPI - Periodo de maior procura
function carregarPeriodoMaiorProcura(area) {
  const instrucaoSql = `
    SELECT 
        periodo,
        total_inscritos
    FROM (
        SELECT 'Diurno' AS periodo, SUM(c.qtd_incritos_diurno) AS total_inscritos 
        FROM curso_ofertado_tb c
        JOIN curso_tb ct ON c.fk_curso = ct.id_curso
        JOIN area_tb a ON ct.fk_area = a.id_area
        WHERE a.nome = '${area}' AND c.ano = 2023

        UNION

        SELECT 'Noturno', SUM(c.qtd_incritos_noturno)
        FROM curso_ofertado_tb c
        JOIN curso_tb ct ON c.fk_curso = ct.id_curso
        JOIN area_tb a ON ct.fk_area = a.id_area
        WHERE a.nome = '${area}' AND c.ano = 2023

        UNION

        SELECT 'EAD', SUM(c.qtd_incritos_ead)
        FROM curso_ofertado_tb c
        JOIN curso_tb ct ON c.fk_curso = ct.id_curso
        JOIN area_tb a ON ct.fk_area = a.id_area
        WHERE a.nome = '${area}' AND c.ano = 2023
    ) AS totais
    ORDER BY total_inscritos DESC
    LIMIT 1;
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}




// Grafico - Salarios com maior procura

function salariosMaiorProcura() {
  var instrucaoSql = `SELECT 
    c.nome AS nome_curso,
    SUM(
        co.qtd_incritos +
        co.qtd_incritos_diurno +
        co.qtd_incritos_noturno +
        co.qtd_incritos_ead
    ) AS total_inscritos
FROM 
    curso_ofertado_tb co
JOIN 
    curso_tb c ON co.fk_curso = c.id_curso
GROUP BY 
    c.nome
ORDER BY 
    total_inscritos DESC
LIMIT 10;
`;  
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


// Grafico - Salario por Area

function salarioPorArea() {
  var instrucaoSql = `SELECT
    a.nome AS area,
    ROUND(AVG(de.salario_mensal), 2) AS salario_medio
FROM dados_empregabilidade_tb de
JOIN area_tb a ON de.fk_area = a.id_area
WHERE de.salario_mensal > 0
GROUP BY a.nome
ORDER BY salario_medio DESC;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarFiltroArea(area) {
  var instrucaoSql = `SELECT nome FROM area_tb ORDER BY nome;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  empregabilidadePorArea,
  carregarKpiOfertaCursos,
  carregarPeriodoMaiorProcura,
  carregarRetencaoAlunos,
  salariosMaiorProcura,
  salarioPorArea,
  buscarFiltroArea,
};
