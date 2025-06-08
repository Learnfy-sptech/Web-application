window.addEventListener("load", function () {
  mostarNomeH1();
  loadProfileImage();
  carregarKpiOfertaCursos();
  carregarPeriodoMaiorProcura();
  salarioPorAreaGrafico();
  carregarAreasNoSelect();
  graficoCursosMaisProcurados();
});


function carregarAreasNoSelect() {
  fetch("/gestor/filtroArea", { cache: "no-store" })
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


function carregarKpiOfertaCursos() {
  fetch("/gestor/ofertaCursos", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar KPI de oferta de cursos");
      return res.json();
    })
    .then(dados => {
      if (dados.length === 0) return;

      const ultimoAno = dados[dados.length - 1];

      const texto = `
        Diurno - ${ultimoAno.total_diurno} vagas<br>
        Noturno - ${ultimoAno.total_noturno} vagas<br>
        EAD - ${ultimoAno.total_ead} vagas
      `;

      document.getElementById("kpi-crescimento-oferta").innerHTML = texto;
    })
    .catch(err => {
      console.error("Erro ao carregar KPI de oferta de cursos:", err);
    });
}



function carregarPeriodoMaiorProcura() {
  fetch("/gestor/periodoMaiorProcura", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar o período com maior procura");
      return res.json();
    })
    .then((dados) => {
      if (dados.length > 0) {
        const { periodo, total_inscritos } = dados[0];
        document.getElementById("kpi-periodo-maior-procura").innerText = `${periodo} - ${total_inscritos} INSCRITOS`;
      } else {
        document.getElementById("kpi-periodo-maior-procura").innerText = "Nenhum dado encontrado";
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar KPI de período com maior procura:", err);
      document.getElementById("kpi-periodo-maior-procura").innerText = "Erro ao carregar";
    });
}



function salarioPorAreaGrafico() {
  fetch("/gestor/salarioPorArea", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar salários");
      return res.json();
    })
    .then((dados) => {
      const categorias = dados.map((item) => item.area);
      const salarios = dados.map((item) => item.salario_medio);

      Highcharts.chart("container", {
        chart: {
          type: "column"
        },
        title: {
          text: "Salário Médio por Área (2023)"
        },
        xAxis: {
          categories: categorias,
          title: {
            text: "Áreas"
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: "Salário Médio (R$)"
          },
          labels: {
            formatter: function () {
              return "R$ " + this.value.toFixed(2).replace(".", ",");
            }
          }
        },
        tooltip: {
          pointFormat: "<b>R$ {point.y:.2f}</b>"
        },
        series: [
          {
            name: "Salário médio",
            data: salarios,
            color: "#4e73df"
          }
        ],
        credits: {
          enabled: false
        }
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar gráfico de salário por área:", err);
    });
}


function graficoCursosMaisProcurados() {
  fetch("/gestor/salariosMaiorProcura", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar cursos mais procurados");
      return res.json();
    })
    .then((dados) => {
      console.log("Dados recebidos:", dados);

      if (!Array.isArray(dados) || dados.length === 0) {
        document.getElementById("pieChart").innerHTML = "<p>Nenhum dado disponível.</p>";
        return;
      }

      const data = dados.map((item) => ({
        name: item.nome_curso,
        y: Number(item.total_inscritos)
      }));

Highcharts.chart("pieChart", {
  chart: {
    type: 'pie',
    backgroundColor: '#ffffff', // fundo branco padrão
    plotShadow: false,
  },
  title: {
    text: 'Top 10 Cursos com Maior Procura (2023)'
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} inscritos)'
  },
  plotOptions: {
    pie: {
      innerSize: '60%',
      depth: 45,
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      }
    }
  },
  series: [{
    name: 'Inscritos',
    data: data,
    colorByPoint: true
  }],
  credits: {
    enabled: false
  }
});
})
    .catch((err) => {
      console.error("Erro ao carregar gráfico de cursos mais procurados:", err);
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


