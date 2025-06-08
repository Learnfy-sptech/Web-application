const { json } = require("express");

function mostarNomeH1() {
      const tipoConta = sessionStorage.getItem('TIPO_CONTA');
      const tipoContaTitulo = document.getElementById('tipoContaUsuarioTitulo');
      
      
      let userTypeText = 'Usuário';

      if (tipoConta === 'DIRETOR ACADEMICO') {
        userTypeText = 'Diretor';
      } else if (tipoConta === 'GESTOR') {
        userTypeText = 'Gestor';
      } else if (tipoConta === 'PESQUISADOR') {
        userTypeText = 'Pesquisador';
      }

      if (tipoContaTitulo) tipoContaTitulo.textContent = userTypeText;
    }

    window.addEventListener('load', function () {
      mostarNomeH1();
      loadProfileImage();
    });


    Highcharts.chart('container', {
      chart: { type: 'column' },
      title: { text: 'Comparação entre instituição privada e pública' },
      subtitle: {
        text: 'Fonte: MEC'
      },
      xAxis: {
        categories: ['2021', '2022', '2023'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: { text: 'Alunos' }
      },
      tooltip: { valueSuffix: ' Alunos' },
      plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
      series: [
        { name: 'Privada', data: [387749, 280000, 129000] },
        { name: 'Pública', data: [45321, 140000, 10000] }
      ]
    });

    Highcharts.chart('container2', {
      chart: { type: 'line' },
      title: { text: 'Projeção de evasão' },
      subtitle: {
        text: 'Fonte: INEP'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: { title: { text: 'Evasão' } },
      plotOptions: {
        line: {
          dataLabels: { enabled: true },
          enableMouseTracking: false
        }
      },
      series: [
        {
          name: 'Evasão anual',
          data: [100.0, 1800.2, 2003.1, 2700.9, 3200.2, 3600.4, 3900.8, 3800.4, 3500.5, 2090.2, 2221.0]
        }
      ]
    });

  
function getKpiQtdCursantes() {
    var filtroArea = document.getElementById('select-areas').value;
    console.log("Valor selecionado no filtroArea:", filtroArea);
    var kpiQtdCursantes = document.getElementById('kpiQtdCursantes'); 

  fetch(`/dashboardPesquisador/getKpiQtdCursantes/${filtroArea}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(function (resposta) {
      resposta.json().then(json => {
        
      console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
        
      kpiQtdCursantes.innerHTML = json.totalCursantes; 
        
    })
    })
    .catch(function (error) {
        console.log("Eroo" + resposta)
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiPessoasTrabalhamNaArea(){
    var filtroArea = document.getElementById('select-areas').value;
    console.log("Valor selecionado no filtroArea:", filtroArea);
    var KpiPessoasTrabalhamNaArea = document.getElementById('KpiPessoasTrabalhamNaArea'); 

  fetch(`/dashboardPesquisador/getKpiPessoasTrabalhamNaArea/${filtroArea}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(function (resposta) {
      resposta.json().then(json => {
        
      console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
        
      KpiPessoasTrabalhamNaArea.innerHTML = json.totalTrabalham; 
        
    })
    })
    .catch(function (error) {
        console.log("Eroo" + resposta)
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiEvasaoPorModalidade(){
    var filtroArea = document.getElementById('select-areas').value;
    console.log("Valor selecionado no filtroArea:", filtroArea);
    var KpiEvasaoModalidade = document.getElementById('KpiEvasaoModalidade'); 

  fetch(`/dashboardPesquisador/getKpiEvasaoPorModalidade/${filtroArea}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(function (resposta) {
      resposta.json().then(json => {
        
      console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
        
      KpiEvasaoModalidade.innerHTML = json.qtdEvasao; 
        
    })
    })
    .catch(function (error) {
        console.log("Eroo" + resposta)
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getKpiMediaSalarial(){
    var filtroArea = document.getElementById('select-areas').value;
    console.log("Valor selecionado no filtroArea:", filtroArea);
    var KpiMediaSalarial = document.getElementById('KpiMediaSalarial'); 

  fetch(`/dashboardPesquisador/getKpiMediaSalarial/${filtroArea}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(function (resposta) {
      resposta.json().then(json => {
        
      console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
        
      KpiMediaSalarial.innerHTML = json.mediaSalarial; 
        
    })
    })
    .catch(function (error) {
        console.log("Eroo" + resposta)
      console.error(`Erro na obtenção de dados para a KPI ${error.message}`);
    });
}

function getGraficoCursosMaiorRetorno(){

}

function getGraficoProjecaoEvasao(){

}

window.getKpiQtdCursantes = getKpiQtdCursantes;
window.getKpiPessoasTrabalhamNaArea = getKpiPessoasTrabalhamNaArea;
window.getKpiEvasaoPorModalidade = getKpiEvasaoPorModalidade;
window.getKpiMediaSalarial = getKpiMediaSalarial;
window.getGraficoCursosMaiorRetorno = getGraficoCursosMaiorRetorno;
window.getGraficoProjecaoEvasao = getGraficoProjecaoEvasao;

document.getElementById("select-areas").addEventListener("change", function () {
  getKpiQtdCursantes();
  getKpiPessoasTrabalhamNaArea();
  getKpiEvasaoPorModalidade();
  getKpiMediaSalarial();
  getGraficoCursosMaiorRetorno();
  getGraficoProjecaoEvasao();
});
