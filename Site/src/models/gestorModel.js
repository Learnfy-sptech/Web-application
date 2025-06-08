var database = require("../database/config");

// KPI - Oferta Cursos

function ofertaCursos() {
  var instrucaoSql = `SELECT 
    ano,
    SUM(qtd_vagas_diurno) AS total_diurno,
    SUM(qtd_vagas_noturno) AS total_noturno,
    SUM(qtd_vagas_ead) AS total_ead
FROM 
    curso_ofertado_tb
WHERE 
    ano IS NOT NULL AND ano >= 2023
GROUP BY 
    ano
ORDER BY 
    ano;
`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


// KPI - Periodo de maior procura
function periodoMaiorProcura() {
  var instrucaoSql = `
SELECT 
    periodo,
    total_inscritos
FROM (
    SELECT 'Diurno' AS periodo, SUM(qtd_incritos_diurno) AS total_inscritos 
    FROM curso_ofertado_tb
    WHERE ano = 2023
    UNION
    SELECT 'Noturno', SUM(qtd_incritos_noturno) 
    FROM curso_ofertado_tb
    WHERE ano = 2023
    UNION
    SELECT 'EAD', SUM(qtd_incritos_ead) 
    FROM curso_ofertado_tb
    WHERE ano = 2023
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
  ofertaCursos,
  periodoMaiorProcura,
  salariosMaiorProcura,
  salarioPorArea,
  buscarFiltroArea,
};
