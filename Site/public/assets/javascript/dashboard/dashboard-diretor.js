window.addEventListener("load", function () {
  mostarNomeH1();
  loadProfileImage();
  buscarCursosMaiorRetorno();
  carregarAreasNoSelect();
  carregarGraficoCotaBolsista();
  carregarKpiTotalAlunos();
  carregarKpiTaxaIngressantes();
});


function carregarAreasNoSelect() {
  fetch("/diretor/filtroArea", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar áreas");
      return res.json();
    })
    .then((areas) => {
      const select = document.getElementById("select-example");

      while (select.options.length > 1) {
        select.remove(1);
      }

      areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area.nome;
        option.textContent = area.nome;
        select.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar áreas:", err);
    });
}


function carregarKpiTotalAlunos() {
  fetch("/diretor/vagasConcluintes", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar dados de alunos.");
      return res.json();
    })
    .then((dados) => {
      let totalAlunos = 0;

      dados.forEach((registro) => {
        totalAlunos += registro.qtd_concluintes;
      });

      document.getElementById("kpi-alunos").textContent =
        totalAlunos.toLocaleString("pt-BR");
    })
    .catch((erro) => {
      console.error("Erro ao carregar KPI de alunos:", erro);
      document.getElementById("kpi-alunos").textContent = "Erro";
    });
}


function carregarKpiTaxaIngressantes() {
  fetch('/diretor/taxaIngressantes', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar taxa de ingressantes.");
      return res.json();
    })
    .then(dados => {
      if (!dados || dados.length === 0) {
        document.getElementById("kpi-ativos").textContent = "Sem dados";
        return;
      }

      // Encontra o registro mais recente com taxa válida
      let maisRecente = null;

      dados.forEach(registro => {
        if (registro.taxa_ingressantes !== null) {
          if (!maisRecente || registro.ano > maisRecente.ano) {
            maisRecente = registro;
          }
        }
      });

      if (maisRecente) {
        const taxaFormatada = (maisRecente.taxa_ingressantes * 100).toFixed(1).replace('.', ',') + "%";
        document.getElementById("kpi-ativos").textContent = taxaFormatada;
      } else {
        document.getElementById("kpi-ativos").textContent = "Sem dados válidos";
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de taxa de ingressantes:", erro);
      document.getElementById("kpi-ativos").textContent = "Erro";
    });
}





function buscarCursosMaiorRetorno() {
  fetch("/diretor/cursosMaiorRetorno", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Erro na requisição");
      return response.json();
    })
    .then((data) => {
      console.log("Cursos com maior retorno:", data);

      const nomesCursos = data.map((item) => item.curso_nome);
      const mediasSalario = data.map((item) => item.media_salario);

      Highcharts.chart("container", {
        chart: {
          type: "column",
        },
        title: {
          text: "Top 10 Cursos com Maior Retorno (Salário Médio)",
        },
        xAxis: {
          categories: nomesCursos,
          title: {
            text: "Cursos",
          },
          labels: {
            rotation: -45,
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Salário Médio (R$)",
          },
        },
        tooltip: {
          pointFormat: "Salário médio: <b>R${point.y:.2f}</b>",
        },
        series: [
          {
            name: "Salário Médio",
            data: mediasSalario,
            colorByPoint: true,
          },
        ],
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar os cursos:", error);
      Swal.fire(
        "Erro",
        "Não foi possível carregar os dados dos cursos com maior retorno.",
        "error"
      );
    });
}


function carregarGraficoCotaBolsista() {
  fetch("/diretor/cotaPorBolsista", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar dados de cota por bolsista");
      return res.json();
    })
    .then((dados) => {
      console.log("Dados recebidos:", dados);

      let totalConcluintes = 0;
      let totalBolsistas = 0;

      dados.forEach((registro) => {
        totalConcluintes += registro.qtd_concluintes;
        totalBolsistas += registro.concluintes_bolsistas;
      });

      const totalNaoBolsistas = totalConcluintes - totalBolsistas;

      Highcharts.chart("pieChart", {
        chart: {
          type: "pie",
          events: {
            render() {
              const chart = this;
              const series = chart.series[0];
              let customLabel = chart.options.chart.custom?.label;

              if (!customLabel) {
                customLabel = chart.options.chart.custom = {
                  label: chart.renderer
                    .label(
                      "Total<br/>" + `<strong>${totalConcluintes}</strong>`
                    )
                    .css({
                      color: "#000",
                      textAnchor: "middle",
                    })
                    .add(),
                }.label;
              }

              const x = series.center[0] + chart.plotLeft;
              const y =
                series.center[1] +
                chart.plotTop -
                customLabel.attr("height") / 2;

              customLabel.attr({ x, y });
              customLabel.css({ fontSize: `${series.center[2] / 12}px` });
            },
          },
        },
        title: {
          text: "Proporção de Concluintes Bolsistas vs Não Bolsistas",
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
        plotOptions: {
          pie: {
            innerSize: "75%",
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              {
                enabled: true,
                format: "{point.name}: {point.y}",
              },
            ],
          },
        },
        series: [
          {
            name: "Alunos",
            colorByPoint: true,
            data: [
              { name: "Bolsistas", y: totalBolsistas },
              { name: "Não Bolsistas", y: totalNaoBolsistas },
            ],
          },
        ],
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar gráfico de cota por bolsista:", erro);
    });
}


function mostarNomeH1() {
  const tipoConta = sessionStorage.getItem("TIPO_CONTA");
  const tipoContaTitulo = document.getElementById("tipoContaUsuarioTitulo");

  if (tipoConta === "DIRETOR ACADEMICO") {
    userTypeText = "Diretor";
  } else if (tipoConta === "GESTOR") {
    userTypeText = "Gestor";
  } else if (tipoConta === "PESQUISADOR") {
    userTypeText = "Pesquisador";
  }

  if (tipoContaTitulo) tipoContaTitulo.textContent = userTypeText;
}
