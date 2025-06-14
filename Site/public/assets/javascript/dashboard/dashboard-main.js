 window.addEventListener("load", function () {
  loadProfileImage();
});

 
 document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do DOM
    const formFiltro = document.getElementById('formFiltroCompleto');
    const inputRegiao = document.getElementById('inputRegiaoFiltro'); // Adicionei ID ao input
    const selectArea = document.getElementById('select-example');
    const resultadoDiv = document.getElementById('resultadoFiltro');

    // Referências aos elementos KPI
    const kpiEvasao = document.getElementById('kpi-evasao');
    const kpiEmpregabilidade = document.getElementById('kpi-empregabilidade');
    const kpiProcura = document.getElementById('kpi-procura');
    const kpiMatriculas = document.getElementById('kpi-matriculas');

    // Instâncias dos gráficos Highcharts (serão inicializadas na função initCharts)
    let chartEvasao; // container
    let chartDemanda; // container2
    let chartInscricao; // barChartArea (antigo pieChart)

    // --- FUNÇÕES AUXILIARES ---

    /**
     * Inicializa todos os gráficos Highcharts com dados vazios/placeholder.
     * Esta função é chamada uma vez ao carregar a página.
     */
    function initCharts() {
        // Gráfico de Taxa de Inscrição por Curso (ID: barChartArea)
        chartInscricao = Highcharts.chart('barChartArea', {
            chart: {
                type: 'bar',
                colors: ['#800000', '#1d1d1d', '#993333'] // Cores das barras
            },
            title: {
                text: 'Taxa de Inscrição por Curso'
            },
            subtitle: {
                text: 'Dados fornecidos pelo backend'
            },
            xAxis: {
                categories: [], // Populado pelo backend
                title: { text: 'Cursos' },
                gridLineWidth: 1,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: { text: 'Número de Inscrições', align: 'high' },
                labels: { overflow: 'justify' },
                gridLineWidth: 0
            },
            tooltip: { valueSuffix: ' inscrições' },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    dataLabels: { enabled: true },
                    groupPadding: 0.1
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: { enabled: false },
            series: [{
                name: 'Inscrições',
                data: [] // Populado pelo backend
            }]
        });

        // Gráfico de Evasão por Curso (%) (ID: container)
        chartEvasao = Highcharts.chart('container', {
            chart: {
                type: 'column',
                colors: ['#800000', '#1d1d1d', '#993333']
            },
            title: {
                text: 'Evasão por Curso (%)'
            },
            subtitle: {
                text: 'Clique nas colunas para ver detalhes (se aplicável). Dados fornecidos pelo backend'
            },
            accessibility: {
                announceNewData: { enabled: true }
            },
            xAxis: {
                type: 'category',
                categories: [] // Populado pelo backend
            },
            yAxis: {
                title: { text: 'Porcentagem de Evasão' },
                labels: { format: '{value:.1f}%' }
            },
            legend: { enabled: false },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: true, format: '{point.y:.1f}%' },
                    colorByPoint: true
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> de evasão<br/>'
            },
            series: [{
                name: 'Cursos',
                data: [] // Populado pelo backend
            }],
            drilldown: {
                breadcrumbs: { position: { align: 'right' } },
                series: [] // Populado pelo backend, se houver drilldown
            }
        });

        // Gráfico de Cursos por Demanda (ID: container2)
        chartDemanda = Highcharts.chart('container2', {
            chart: {
                type: 'column',
                colors: ['#800000', '#1d1d1d', '#993333']
            },
            title: {
                text: 'Cursos por Demanda'
            },
            subtitle: {
                text: 'Clique nas colunas para ver detalhes (se aplicável). Dados fornecidos pelo backend'
            },
            accessibility: {
                announceNewData: { enabled: true }
            },
            xAxis: {
                type: 'category',
                categories: [] // Populado pelo backend
            },
            yAxis: {
                title: { text: 'Nível de Demanda' }
            },
            legend: { enabled: false },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: true, format: '{point.y:.0f}' },
                    colorByPoint: true
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b> de demanda<br/>'
            },
            series: [{
                name: 'Demanda',
                data: [] // Populado pelo backend
            }],
            drilldown: {
                breadcrumbs: { position: { align: 'right' } },
                series: [] // Populado pelo backend, se houver drilldown
            }
        });
    }

    /**
     * Simula a busca de dados do backend e atualiza KPIs e gráficos.
     * Em um cenário real, esta função faria uma chamada fetch/AJAX.
     * @param {string} regiao O valor do filtro de região.
     * @param {string} area O valor do filtro de área.
     */
    function fetchDataAndApplyFilters(regiao, area) {
        // Exibe uma mensagem de carregamento (opcional)
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = '<p style="color: #800000;">Carregando dados...</p>';

        // --- SIMULAÇÃO DE DADOS DO BACKEND ---
        // Em um cenário real, você faria algo como:
        // fetch(`/api/dashboard-data?regiao=${regiao}&area=${area}`)
        //   .then(response => response.json())
        //   .then(data => {
        //     // 'data' seria um objeto contendo os valores dos KPIs e os dados dos gráficos
        //     // Exemplo de estrutura de 'data':
        //     // {
        //     //   kpis: { evasao: 10.5, empregabilidade: 'SP (85%)', procura: 1500, matriculas: 12.3 },
        //     //   graficos: {
        //     //     inscricao: { categories: ['Curso A', 'Curso B'], series: [{ name: 'Inscrições', data: [100, 200] }] },
        //     //     evasao: { categories: ['Curso X', 'Curso Y'], series: [{ name: 'Evasão', data: [5.0, 7.5] }] },
        //     //     demanda: { categories: ['Curso P', 'Curso Q'], series: [{ name: 'Demanda', data: [300, 450] }] }
        //     //   }
        //     // }

        //     updateKPIs(data.kpis);
        //     updateCharts(data.graficos);
        //     resultadoDiv.style.display = 'none'; // Esconde a mensagem
        //   })
        //   .catch(error => {
        //     console.error('Erro ao buscar dados:', error);
        //     resultadoDiv.innerHTML = '<p style="color: red;">Erro ao carregar dados. Tente novamente.</p>';
        //   });

        // --- DADOS DE TESTE (REMOVA ESTA PARTE QUANDO CONECTAR AO BACKEND) ---
        setTimeout(() => { // Simula um atraso de rede
            let kpiData = {};
            let chartData = {};

            // Lógica de simulação baseada nos filtros
            if (regiao.toLowerCase().includes('são paulo') && area === '1') { // Exemplo combinado
                kpiData = { evasao: 8.2, empregabilidade: 'São Paulo (92%)', procura: 2500, matriculas: 15.0 };
                chartData = {
                    inscricao: { categories: ['Matemática', 'Física'], series: [{ name: 'Inscrições', data: [350, 280] }] },
                    evasao: { categories: ['Matemática', 'Física'], series: [{ name: 'Evasão', data: [4.5, 6.0] }] },
                    demanda: { categories: ['Matemática', 'Física'], series: [{ name: 'Demanda', data: [400, 320] }] }
                };
            } else if (regiao.toLowerCase().includes('rio') && area === '2') { // Outro exemplo combinado
                kpiData = { evasao: 14.5, empregabilidade: 'Rio de Janeiro (78%)', procura: 900, matriculas: 3.5 };
                chartData = {
                    inscricao: { categories: ['Literatura', 'História'], series: [{ name: 'Inscrições', data: [180, 220] }] },
                    evasao: { categories: ['Literatura', 'História'], series: [{ name: 'Evasão', data: [11.0, 9.8] }] },
                    demanda: { categories: ['Literatura', 'História'], series: [{ name: 'Demanda', data: [200, 250] }] }
                };
            } else if (area === '1') { // Filtrar apenas por área: Exatas
                kpiData = { evasao: 7.0, empregabilidade: 'Norte (90%)', procura: 2000, matriculas: 10.0 };
                chartData = {
                    inscricao: { categories: ['Engenharia', 'TI', 'Química'], series: [{ name: 'Inscrições', data: [400, 500, 300] }] },
                    evasao: { categories: ['Engenharia', 'TI', 'Química'], series: [{ name: 'Evasão', data: [6.0, 5.5, 8.0] }] },
                    demanda: { categories: ['Engenharia', 'TI', 'Química'], series: [{ name: 'Demanda', data: [500, 600, 350] }] }
                };
            } else if (area === '2') { // Filtrar apenas por área: Humanas
                kpiData = { evasao: 12.0, empregabilidade: 'Centro (75%)', procura: 1000, matriculas: 5.0 };
                chartData = {
                    inscricao: { categories: ['Psicologia', 'Direito', 'Jornalismo'], series: [{ name: 'Inscrições', data: [250, 320, 190] }] },
                    evasao: { categories: ['Psicologia', 'Direito', 'Jornalismo'], series: [{ name: 'Evasão', data: [9.0, 7.0, 11.0] }] },
                    demanda: { categories: ['Psicologia', 'Direito', 'Jornalismo'], series: [{ name: 'Demanda', data: [300, 400, 220] }] }
                };
            } else if (area === '3') { // Filtrar apenas por área: Saúde
                kpiData = { evasao: 9.5, empregabilidade: 'Sul (88%)', procura: 1800, matriculas: 8.0 };
                chartData = {
                    inscricao: { categories: ['Medicina', 'Enfermagem', 'Nutrição'], series: [{ name: 'Inscrições', data: [500, 380, 250] }] },
                    evasao: { categories: ['Medicina', 'Enfermagem', 'Nutrição'], series: [{ name: 'Evasão', data: [3.0, 5.0, 7.0] }] },
                    demanda: { categories: ['Medicina', 'Enfermagem', 'Nutrição'], series: [{ name: 'Demanda', data: [600, 450, 300] }] }
                };
            } else if (regiao !== "") { // Filtrar apenas por região
                kpiData = { evasao: 10.0, empregabilidade: `${regiao} (80%)`, procura: 1700, matriculas: 7.0 };
                chartData = {
                    inscricao: { categories: ['Curso X', 'Curso Y', 'Curso Z'], series: [{ name: 'Inscrições', data: [280, 350, 420] }] },
                    evasao: { categories: ['Curso X', 'Curso Y', 'Curso Z'], series: [{ name: 'Evasão', data: [8.5, 6.2, 9.1] }] },
                    demanda: { categories: ['Curso X', 'Curso Y', 'Curso Z'], series: [{ name: 'Demanda', data: [350, 400, 500] }] }
                };
            } else { // Nenhum filtro ou filtro padrão
                kpiData = { evasao: 11.5, empregabilidade: 'Nacional (82%)', procura: 1200, matriculas: 6.5 };
                chartData = {
                    inscricao: { categories: ['Geral A', 'Geral B', 'Geral C'], series: [{ name: 'Inscrições', data: [200, 300, 250] }] },
                    evasao: { categories: ['Geral A', 'Geral B', 'Geral C'], series: [{ name: 'Evasão', data: [7.0, 9.0, 8.0] }] },
                    demanda: { categories: ['Geral A', 'Geral B', 'Geral C'], series: [{ name: 'Demanda', data: [250, 350, 300] }] }
                };
            }

            updateKPIs(kpiData);
            updateCharts(chartData);
            resultadoDiv.style.display = 'none'; // Esconde a mensagem após o carregamento
        }, 500); // Simula 0.5 segundos de carregamento
    }

    /**
     * Atualiza os valores exibidos nos cartões de KPI.
     * @param {object} data Objeto contendo os novos valores dos KPIs.
     */
    function updateKPIs(data) {
        if (kpiEvasao) kpiEvasao.textContent = `${data.evasao}%`;
        if (kpiEmpregabilidade) kpiEmpregabilidade.textContent = data.empregabilidade;
        if (kpiProcura) kpiProcura.textContent = data.procura;
        if (kpiMatriculas) kpiMatriculas.textContent = `${data.matriculas}%`;
    }

    /**
     * Atualiza os gráficos Highcharts com novos dados.
     * @param {object} data Objeto contendo os novos dados para cada gráfico.
     */
    function updateCharts(data) {
        // Atualiza Gráfico de Inscrição por Curso (barChartArea)
        if (chartInscricao && data.inscricao) {
            chartInscricao.xAxis[0].setCategories(data.inscricao.categories);
            chartInscricao.series[0].setData(data.inscricao.series[0].data);
        }

        // Atualiza Gráfico de Evasão por Curso (container)
        if (chartEvasao && data.evasao) {
            chartEvasao.xAxis[0].setCategories(data.evasao.categories);
            chartEvasao.series[0].setData(data.evasao.series[0].data);
            // Se houver drilldown, você também precisaria atualizar chartEvasao.drilldown.update(data.evasao.drilldownSeries);
        }

        // Atualiza Gráfico de Cursos por Demanda (container2)
        if (chartDemanda && data.demanda) {
            chartDemanda.xAxis[0].setCategories(data.demanda.categories);
            chartDemanda.series[0].setData(data.demanda.series[0].data);
            // Se houver drilldown, você também precisaria atualizar chartDemanda.drilldown.update(data.demanda.drilldownSeries);
        }
    }

    // --- EVENT LISTENERS E INICIALIZAÇÃO ---

    // Inicializa os gráficos Highcharts
    initCharts();

    // Adiciona o listener para o formulário de filtro
    if (formFiltro) {
        formFiltro.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const valorRegiao = inputRegiao.value.trim();
            const valorArea = selectArea.value;

            // Validação: Se nenhum filtro foi selecionado ou preenchido
            if (valorRegiao === "" && (valorArea === "" || valorArea === null)) {
                resultadoDiv.style.display = 'block';
                resultadoDiv.innerHTML = '<p style="color: red;">Por favor, digite uma região ou selecione uma área para filtrar.</p>';
                return;
            } else {
                resultadoDiv.style.display = 'none'; // Esconde a mensagem de erro
            }

            // Chama a função para buscar e aplicar os dados filtrados
            fetchDataAndApplyFilters(valorRegiao, valorArea);
        });

        // Opcional: Lógica para o botão de "limpar" (reset) do input de região
        const searchGroup = formFiltro.querySelector('.group');
        if (searchGroup) {
            const resetButton = document.createElement('button');
            resetButton.setAttribute('type', 'button'); // Importante ser 'button' e não 'submit'
            resetButton.classList.add('reset-search'); // Adicione uma classe para estilização, se necessário
            resetButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>`;
            // Insere o botão de reset após o input
            inputRegiao.parentNode.insertBefore(resetButton, inputRegiao.nextSibling);

            resetButton.addEventListener('click', function() {
                inputRegiao.value = ''; // Limpa o campo de texto
                // Se quiser aplicar o filtro imediatamente após limpar a região, chame:
                // fetchDataAndApplyFilters('', selectArea.value);
            });
        }
    }

    // Carrega os dados iniciais (sem filtro) ao carregar a página
    fetchDataAndApplyFilters("", "");
});