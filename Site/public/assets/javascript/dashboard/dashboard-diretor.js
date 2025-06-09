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

function carregarKpiTotalIngressantes() {
  fetch("/diretor/totalIngressantes", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar taxa de ingressantes.");
      return res.json();
    })
    .then((dados) => {
      if (!dados || dados.length === 0) {
        document.getElementById("kpi-ativos").textContent = "Sem dados";
        return;
      }

      const total = dados[0].total_ingressantes;
      if (total === null || total === undefined) {
        document.getElementById("kpi-ativos").textContent = "Sem dados de 2023";
        return;
      }

      document.getElementById("kpi-ativos").textContent =
        total.toLocaleString("pt-BR") + " alunos";
    })
    .catch((erro) => {
      console.error("Erro ao carregar KPI de ingressantes:", erro);
      document.getElementById("kpi-ativos").textContent = "Erro";
    });
}


function carregarKpiAlunosPrivados() {
  fetch('/diretor/alunosEscolasPrivadas', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de escolas privadas.");
      return res.json();
    })
    .then(dados => {
      if (dados.length > 0 && dados[0].total_privada !== null) {
        document.getElementById("kpi-notas").textContent = dados[0].total_privada;
      } else {
        document.getElementById("kpi-notas").textContent = "Sem dados";
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de escolas privadas:", erro);
      document.getElementById("kpi-notas").textContent = "Erro";
    });
}

function carregarKpiAlunosPublicos() {
  fetch('/diretor/alunosEscolasPublicas', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de escolas públicas.");
      return res.json();
    })
    .then(dados => {
      if (dados.length > 0 && dados[0].total_publica !== null) {
        document.getElementById("kpi-cursos").textContent = dados[0].total_publica;
      } else {
        document.getElementById("kpi-cursos").textContent = "Sem dados";
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de escolas públicas:", erro);
      document.getElementById("kpi-cursos").textContent = "Erro";
    });
}




function buscarAreaMaiorRetorno() {
  fetch("/diretor/areaMaiorRetorno", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Erro na requisição");
      return response.json();
    })
    .then((data) => {
      console.log("Cursos com maior retorno:", data);

      const nomesAreas = data.map((item) => item.area_nome);
      const mediasSalario = data.map((item) => item.media_salario);

      Highcharts.chart("container", {
        chart: {
          type: "column",
        },
        title: {
          text: "Áreas com Maior Retorno (Salário Médio)",
        },
        xAxis: {
          categories: nomesAreas,
          title: {
            text: "Áreas",
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


function carregarGraficoBolsistasPorArea() {
  fetch("/diretor/bolsistasPorArea", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar dados de cota por bolsista");
      return res.json();
    })
    .then((dados) => {
      const container = document.getElementById("pieChart"); // usar id correto
      container.innerHTML = "";

      if (!Array.isArray(dados) || dados.length === 0) {
        container.innerHTML = "<p>Nenhum dado disponível para exibir o gráfico.</p>";
        return;
      }

      // Montar array de dados: cada área e seus bolsistas
      const dataPorArea = dados.map((registro) => {
        return {
          name: registro.nome_area || "Área não especificada",
          y: Number(registro.bolsistas) || 0,
        };
      }).filter(item => item.y > 0); // filtrar áreas com 0 bolsistas para não aparecer no gráfico

      if (dataPorArea.length === 0) {
        container.innerHTML = "<p>Nenhum dado disponível para exibir o gráfico.</p>";
        return;
      }

      // Calcular total para mostrar no centro
      const totalBolsistas = dataPorArea.reduce((acc, cur) => acc + cur.y, 0);

      Highcharts.chart(container, {
        chart: {
          type: "pie",
          events: {
            render() {
              const chart = this;
              const series = chart.series[0];

              if (!series || !series.center) return;

              let customLabel = chart.options.chart.custom?.label;

              if (!customLabel) {
                customLabel = chart.options.chart.custom = {
                  label: chart.renderer
                    .label(`Total Bolsistas<br/><strong>${totalBolsistas}</strong>`)
                    .css({ color: "#000", textAnchor: "middle" })
                    .add(),
                }.label;
              }

              const x = series.center[0] + chart.plotLeft;
              const y = series.center[1] + chart.plotTop - (customLabel.attr("height") || 0) / 2;

              customLabel.attr({ x, y });
              customLabel.css({ fontSize: `${series.center[2] / 12}px` });
            },
          },
        },
        title: {
          text: "Distribuição de Bolsistas por Área",
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})",
        },
        plotOptions: {
          pie: {
            innerSize: "75%",
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "{point.name}: {point.y}",
            },
          },
        },
        series: [{
          name: "Bolsistas",
          colorByPoint: true,
          data: dataPorArea,
        }],
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar gráfico por área:", erro);
      const container = document.getElementById("pieChart");
      container.innerHTML = "<p>Erro ao carregar o gráfico. Tente novamente mais tarde.</p>";
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

window.carregarAreasNoSelect = carregarAreasNoSelect;
window.buscarAreaMaiorRetorno = buscarAreaMaiorRetorno;
window.carregarGraficoBolsistasPorArea = carregarGraficoBolsistasPorArea;
window.carregarKpiTotalAlunos = carregarKpiTotalAlunos;
window.carregarKpiTotalIngressantes = carregarKpiTotalIngressantes;
window.carregarKpiAlunosPrivados = carregarKpiAlunosPrivados;
window.carregarKpiAlunosPublicos = carregarKpiAlunosPublicos;

document.getElementById("select-areas").addEventListener("change", function () {
  carregarAreasNoSelect();
  buscarAreaMaiorRetorno();
  carregarGraficoBolsistasPorArea();
  carregarKpiTotalAlunos();
  carregarKpiTotalIngressantes();
  carregarKpiAlunosPrivados();
  carregarKpiAlunosPublicos();
});
