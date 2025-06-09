const loaderContainer = document.querySelector('.loading');
const contentDashboard = document.querySelector('.content-dashboard');
const selectAreas = document.getElementById("select-areas"); // ID of your filter <select>
const kpiAlunosElement = document.getElementById("kpi-alunos");
const kpiAtivosElement = document.getElementById("kpi-ativos");
const kpiNotasElement = document.getElementById("kpi-notas");
const kpiCursosElement = document.getElementById("kpi-cursos");
const chartContainer1 = document.getElementById("container"); // Column Chart (Areas with Higher Return)
const chartContainer2 = document.getElementById("pieChart"); // Pie Chart (Scholars by Area)
const tipoContaUsuarioElement = document.getElementById("tipoContaUsuario"); 

function carregarAreasNoSelect() {
  return fetch("/diretor/filtroArea", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar áreas: " + res.status);
      return res.json();
    })
    .then(areas => {
      const select = document.getElementById("select-example"); // Verify this ID is correct in your HTML
      if (!select) { console.error("Elemento select-example não encontrado."); return; }

      while (select.options.length > 1) {
        select.remove(1);
      }
      areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area.nome;
        option.textContent = area.nome;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar áreas:", err);
      throw err; 
    });
}

function carregarKpiTotalAlunos() {
  return fetch("/diretor/vagasConcluintes", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de alunos: " + res.status);
      return res.json();
    })
    .then(dados => {
      let totalAlunos = 0;
      dados.forEach(registro => { totalAlunos += registro.qtd_concluintes; });
      if (kpiAlunosElement) kpiAlunosElement.textContent = totalAlunos.toLocaleString("pt-BR") + " concluintes em 2023";
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de alunos:", erro);
      if (kpiAlunosElement) kpiAlunosElement.textContent = "Erro";
      throw erro; 
    });
}

function carregarKpiTotalIngressantes() {
  return fetch("/diretor/totalIngressantes", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar taxa de ingressantes: " + res.status);
      return res.json();
    })
    .then(dados => {
      if (!dados || dados.length === 0 || dados[0].total_ingressantes === null || dados[0].total_ingressantes === undefined) {
        if (kpiAtivosElement) kpiAtivosElement.textContent = "Sem dados";
        return;
      }
      if (kpiAtivosElement) kpiAtivosElement.textContent = dados[0].total_ingressantes.toLocaleString("pt-BR") + " Alunos";
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de ingressantes:", erro);
      if (kpiAtivosElement) kpiAtivosElement.textContent = "Erro";
      throw erro;
    });
}

function carregarKpiAlunosPrivados() {
  return fetch('/diretor/alunosEscolasPrivadas', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de escolas privadas: " + res.status);
      return res.json();
    })
    .then(dados => {
      if (dados.length > 0 && dados[0].total_privada !== null) {
        if (kpiNotasElement) kpiNotasElement.textContent = dados[0].total_privada + " Alunos";
      } else {
        if (kpiNotasElement) kpiNotasElement.textContent = "Sem dados";
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de escolas privadas:", erro);
      if (kpiNotasElement) kpiNotasElement.textContent = "Erro";
      throw erro;
    });
}

function carregarKpiAlunosPublicos() {
  return fetch('/diretor/alunosEscolasPublicas', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de escolas públicas: " + res.status);
      return res.json();
    })
    .then(dados => {
      if (dados.length > 0 && dados[0].total_publica !== null) {
        if (kpiCursosElement) kpiCursosElement.textContent = dados[0].total_publica + " Alunos";
      } else {
        if (kpiCursosElement) kpiCursosElement.textContent = "Sem dados";
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar KPI de escolas públicas:", erro);
      if (kpiCursosElement) kpiCursosElement.textContent = "Erro";
      throw erro;
    });
}

function buscarAreaMaiorRetorno() {
  return fetch("/diretor/areaMaiorRetorno", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Erro na requisição da área de maior retorno: " + response.status);
      return response.json();
    })
    .then(data => {
      const nomesAreas = data.map(item => item.area_nome);
      const mediasSalario = data.map(item => item.media_salario);

      if (chartContainer1) {
          Highcharts.chart(chartContainer1, {
            chart: { type: "column" },
            title: { text: "Áreas com Maior Retorno (Salário Médio)" },
            xAxis: { categories: nomesAreas, title: { text: "Áreas" }, labels: { rotation: -45 } },
            yAxis: { min: 0, title: { text: "Salário Médio (R$)" } },
            tooltip: { pointFormat: "Salário médio: <b>R${point.y:.2f}</b>" },
            series: [{ name: "Salário Médio", data: mediasSalario, colorByPoint: true }],
          });
      }
    })
    .catch(error => {
      console.error("Erro ao buscar os cursos (maior retorno):", error);
      Swal.fire("Erro", "Não foi possível carregar os dados dos cursos com maior retorno.", "error");
      throw error;
    });
}

function carregarGraficoBolsistasPorArea() {
  return fetch("/diretor/bolsistasPorArea", { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dados de cota por bolsista: " + res.status);
      return res.json();
    })
    .then(dados => {
      if (chartContainer2) {
          chartContainer2.innerHTML = "";

          if (!Array.isArray(dados) || dados.length === 0 || dados.filter(item => Number(item.bolsistas) > 0).length === 0) {
            chartContainer2.innerHTML = "<p>Nenhum dado disponível para exibir o gráfico.</p>";
            return;
          }

          const dataPorArea = dados.map(registro => ({
            name: registro.nome_area || "Área não especificada",
            y: Number(registro.bolsistas) || 0,
          })).filter(item => item.y > 0);

          const totalBolsistas = dataPorArea.reduce((acc, cur) => acc + cur.y, 0);

          Highcharts.chart(chartContainer2, {
            chart: { type: "pie", events: { render() {
                const chart = this, series = chart.series[0];
                if (!series || !series.center) return;
                let customLabel = chart.options.chart.custom?.label;
                if (!customLabel) { customLabel = chart.options.chart.custom = { label: chart.renderer.label(`Total Bolsistas<br/><strong>${totalBolsistas}</strong>`).css({ color: "#000", textAnchor: "middle" }).add(), }.label; }
                const x = series.center[0] + chart.plotLeft;
                const y = series.center[1] + chart.plotTop - (customLabel.attr("height") || 0) / 2;
                customLabel.attr({ x, y });
                customLabel.css({ fontSize: `${series.center[2] / 12}px` });
            }},
            },
            title: { text: "Distribuição de Bolsistas por Área" },
            tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})" },
            plotOptions: { pie: { innerSize: "75%", allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: true, format: "{point.name}: {point.y}" }}},
            series: [{ name: "Bolsistas", colorByPoint: true, data: dataPorArea }],
          });
      }
    })
    .catch(erro => {
      console.error("Erro ao carregar gráfico por área (bolsistas):", erro);
      if (chartContainer2) chartContainer2.innerHTML = "<p>Erro ao carregar o gráfico. Tente novamente mais tarde.</p>";
      throw erro;
    });
}

function mostarNomeH1() {
  const tipoConta = sessionStorage.getItem("TIPO_CONTA");
  const tipoContaTituloElement = document.getElementById("tipoContaUsuario"); 
  let userTypeText = "";

  if (tipoConta === "DIRETOR ACADEMICO") {
    userTypeText = "Diretor";
  } else if (tipoConta === "GESTOR") {
    userTypeText = "Gestor";
  } else if (tipoConta === "PESQUISADOR") {
    userTypeText = "Pesquisador";
  }

  if (tipoContaTituloElement) tipoContaTituloElement.textContent = userTypeText;
}
function toggleLoadingState(isLoading) {
    if (isLoading) {
        loaderContainer.style.display = 'flex';
        contentDashboard.style.display = 'none';
    } else {
        loaderContainer.style.display = 'none';
        contentDashboard.style.display = 'block'; 
    }
}

async function loadDashboardData() {
    toggleLoadingState(true); // Show loader

    try {
        await Promise.all([
            carregarAreasNoSelect(),
            carregarKpiTotalAlunos(),
            carregarKpiTotalIngressantes(),
            carregarKpiAlunosPrivados(),
            carregarKpiAlunosPublicos(),
            buscarAreaMaiorRetorno(),
            carregarGraficoBolsistasPorArea()
        ]);

        mostarNomeH1(); 

        console.log("All dashboard data loaded successfully!");

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        Swal.fire(
            "Loading Error",
            "Could not load all dashboard data. Please try again later.",
            "error"
        );
    } finally {
        toggleLoadingState(false); // Hide loader and show dashboard
    }
}

let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let navList = document.querySelector(".nav-list");

if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        navList.classList.toggle("scroll");
        menuBtnChange();
    });
}

if (searchBtn && sidebar) {
    searchBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        navList.classList.toggle("scroll");
        menuBtnChange();
    });
}

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-chevron-left");
    } else {
        closeBtn.classList.replace("bx-chevron-left", "bx-menu");
    }
}

const logOutBtn = document.getElementById("log_out");
if (logOutBtn) {
    logOutBtn.addEventListener("click", function () {
        Swal.fire({
            title: "Sair da conta?",
            text: "Tem certeza que deseja sair?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, sair",
            cancelButtonColor: "#999999",
            confirmButtonColor: "#800000",
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                window.location.href = "/login.html";
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();

    if (selectAreas) {
        selectAreas.addEventListener("change", loadDashboardData);
    } else {
        console.warn("Elemento select com ID 'select-areas' não encontrado. O filtro 'onchange' não funcionará.");
    }

    // User/Account Type Display Logic
    const nome = sessionStorage.getItem("NOME_USUARIO");
    let tipoContaArmazenado = sessionStorage.getItem("TIPO_CONTA");

    if (nome && tipoContaArmazenado) {
        const nomeUsuarioElement = document.getElementById("nomeUsuario");
        const tipoContaUsuarioElement = document.getElementById("tipoContaUsuario"); // This is from the sidebar profile
        if (nomeUsuarioElement) nomeUsuarioElement.textContent = nome;
        if (tipoContaUsuarioElement) tipoContaUsuarioElement.textContent = tipoContaArmazenado;
    }

    const dashboardMap = {
        'diretor_academico': 'diretor',
        'gestor': 'gestor',
        'pesquisador': 'pesquisador',
    };
    const dynamicDashboardLink = document.getElementById('minha-dashboard-link-dinamico');

    let dashboardFileNamePart = '';
    if (tipoContaArmazenado) {
        const tipoContaLower = tipoContaArmazenado.toLowerCase();
        dashboardFileNamePart = dashboardMap[tipoContaLower] || tipoContaLower;
    }
    if (dynamicDashboardLink && dashboardFileNamePart) {
        dynamicDashboardLink.href = `dashboard-${dashboardFileNamePart}.html`;
    }

    // Active Menu Item Logic
    let currentFileName = window.location.pathname.split('/').pop();
    if (currentFileName === '' || currentFileName === '/') {
        currentFileName = 'index.html';
    }
    const menuLinks = document.querySelectorAll('.nav-list a.menu-link');

    menuLinks.forEach(link => {
        link.classList.remove('active');
    });

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentFileName === linkHref ||
            (link.id === 'minha-dashboard-link-dinamico' && currentFileName.startsWith('dashboard-'))) {
            link.classList.add('active');
        }
    });
});