function getKpiQtdCursantes() {
  var filtroArea = document.getElementById("select-areas").value;
  console.log("Valor selecionado no filtroArea:", filtroArea);
  var kpiQtdCursantes = document.getElementById("kpiQtdCursantes");

  fetch(`/dashboardPesquisador/getKpiQtdCursantes/${filtroArea}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      resposta.json().then((json) => {
        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

        kpiQtdCursantes.innerHTML = json.totalCursantes;
      });
    })
    .catch(function (error) {
      console.log("Eroo" + resposta);
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiPessoasTrabalhamNaArea() {
  var filtroArea = document.getElementById("select-areas").value;
  console.log("Valor selecionado no filtroArea:", filtroArea);
  var KpiPessoasTrabalhamNaArea = document.getElementById(
    "KpiPessoasTrabalhamNaArea"
  );

  fetch(`/dashboardPesquisador/getKpiPessoasTrabalhamNaArea/${filtroArea}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      resposta.json().then((json) => {
        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

        KpiPessoasTrabalhamNaArea.innerHTML = json.totalTrabalham;
      });
    })
    .catch(function (error) {
      console.log("Eroo" + resposta);
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiEvasaoPorModalidade() {
  var filtroArea = document.getElementById("select-areas").value;
  console.log("Valor selecionado no filtroArea:", filtroArea);
  var KpiEvasaoModalidade = document.getElementById("KpiEvasaoModalidade");

  fetch(`/dashboardPesquisador/getKpiEvasaoPorModalidade/${filtroArea}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      resposta.json().then((json) => {
        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

        KpiEvasaoModalidade.innerHTML = json.qtdEvasao;
      });
    })
    .catch(function (error) {
      console.log("Eroo" + resposta);
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiMediaSalarial() {
  var filtroArea = document.getElementById("select-areas").value;
  console.log("Valor selecionado no filtroArea:", filtroArea);
  var KpiMediaSalarial = document.getElementById("KpiMediaSalarial");

  fetch(`/dashboardPesquisador/getKpiMediaSalarial/${filtroArea}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      resposta.json().then((json) => {
        console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

        KpiMediaSalarial.innerHTML = json.mediaSalarial;
      });
    })
    .catch(function (error) {
      console.log("Eroo" + resposta);
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}


function getGraficoInstituicoes() {
  fetch("/dashboardPesquisador/getGraficoInstituicoes")
    .then((res) => res.json())
    .then((dados) => {
      if (!Array.isArray(dados) || dados.length === 0) {
        console.warn("Nenhum dado recebido.");
        return;
      }

      const anos = dados.map(item => item.ano);
      const redePublica = dados.map(item => Number(item.ingressantes_publica));
      const redePrivada = dados.map(item => Number(item.ingressantes_privada));

      Highcharts.chart("container", {
        chart: {
          type: "line"
        },
        title: {
          text: "Ingressantes por Tipo de Instituição (2021 a 2023)"
        },
        subtitle: {
          text: "Fonte: INEP"
        },
        xAxis: {
          categories: anos,
          title: { text: "Ano" }
        },
        yAxis: {
          title: {
            text: "Quantidade de Ingressantes"
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: " alunos"
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: true
          }
        },
        series: [
          {
            name: "Rede Pública",
            data: redePublica,
            color: "#28a745"
          },
          {
            name: "Rede Privada",
            data: redePrivada,
            color: "#007bff"
          }
        ]
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar gráfico:", erro);
    });
}






function getGraficoProjecaoEvasao() {
  fetch("/dashboardPesquisador/getGraficoProjecaoEvasao")
    .then((res) => res.json())
    .then((dados) => {
      if (!Array.isArray(dados) || dados.length === 0) {
        console.warn("Nenhum dado de evasão recebido.");
        return;
      }

      const anos = [];
      const evasoes = [];

      dados.forEach((item) => {
        const ano = item.ano;
        const evasao = parseInt(item.evasao_estimativa);

        anos.push(ano);

        // Se for 2024, adiciona com cor diferente
        if (ano === 2024) {
          evasoes.push({ y: evasao, color: "#f39c12" }); // cor laranja (projeção)
        } else {
          evasoes.push(evasao);
        }
      });

      Highcharts.chart("container2", {
        chart: {
          type: "column",
        },
        title: {
          text: "Projeção de Evasão Estimada por Ano no Brasil",
        },
        subtitle: {
          text: "Fonte: INEP",
        },
        xAxis: {
          categories: anos,
          title: { text: "Ano" },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Quantidade de Evasões Estimadas",
          },
        },
        tooltip: {
          pointFormat: "Evasão: <b>{point.y}</b>",
        },
        series: [
          {
            name: "Evasão Estimada",
            data: evasoes,
            colorByPoint: true,
          },
        ],
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar gráfico de evasão:", erro);
    });
}


window.getKpiQtdCursantes = getKpiQtdCursantes;
window.getKpiPessoasTrabalhamNaArea = getKpiPessoasTrabalhamNaArea;
window.getKpiEvasaoPorModalidade = getKpiEvasaoPorModalidade;
window.getKpiMediaSalarial = getKpiMediaSalarial;
window.getGraficoInstituicoes = getGraficoInstituicoes;
window.getGraficoProjecaoEvasao = getGraficoProjecaoEvasao;

document.getElementById("select-areas").addEventListener("change", function () {
  getKpiQtdCursantes();
  getKpiPessoasTrabalhamNaArea();
  getKpiEvasaoPorModalidade();
  getKpiMediaSalarial();
  getGraficoInstituicoes();
  getGraficoProjecaoEvasao();
});

function mostarNomeH1() {
  const tipoConta = sessionStorage.getItem("TIPO_CONTA");
  const tipoContaTitulo = document.getElementById("tipoContaUsuarioTitulo");

  let userTypeText = "Usuário";

  if (tipoConta === "DIRETOR ACADEMICO") {
    userTypeText = "Diretor";
  } else if (tipoConta === "GESTOR") {
    userTypeText = "Gestor";
  } else if (tipoConta === "PESQUISADOR") {
    userTypeText = "Pesquisador";
  }

  if (tipoContaTitulo) tipoContaTitulo.textContent = userTypeText;
}

window.addEventListener("load", function () {
  mostarNomeH1();
  loadProfileImage();
});
