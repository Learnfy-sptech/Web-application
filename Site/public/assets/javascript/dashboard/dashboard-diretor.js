 window.addEventListener('load', function () {
    mostarNomeH1();
    loadProfileImage();
    buscarCursosMaiorRetorno();
    carregarAreasNoSelect();
  });


  function carregarAreasNoSelect() {
    fetch('/diretor/filtroArea', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar áreas');
        return res.json();
      })
      .then(areas => {
        const select = document.getElementById('select-example');

        while (select.options.length > 1) {
          select.remove(1);
        }

        areas.forEach(area => {
          const option = document.createElement('option');
          option.value = area.nome; 
          option.textContent = area.nome;
          select.appendChild(option);
        });
      })
      .catch(err => {
        console.error('Erro ao carregar áreas:', err);
      });
  }


  function buscarCursosMaiorRetorno() {
    fetch('/diretor/cursosMaiorRetorno', { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error("Erro na requisição");
        return response.json();
      })
      .then(data => {
        console.log("Cursos com maior retorno:", data);

        const nomesCursos = data.map(item => item.curso_nome);
        const mediasSalario = data.map(item => item.media_salario);

        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Top 10 Cursos com Maior Retorno (Salário Médio)'
          },
          xAxis: {
            categories: nomesCursos,
            title: {
              text: 'Cursos'
            },
            labels: {
              rotation: -45
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Salário Médio (R$)'
            }
          },
          tooltip: {
            pointFormat: 'Salário médio: <b>R${point.y:.2f}</b>'
          },
          series: [{
            name: 'Salário Médio',
            data: mediasSalario,
            colorByPoint: true
          }]
        });
      })
      .catch(error => {
        console.error("Erro ao buscar os cursos:", error);
        Swal.fire("Erro", "Não foi possível carregar os dados dos cursos com maior retorno.", "error");
      });
  }




  // HIGHCHARTS - Gráficos específicos da dashboard Diretor
  const pieChart = document.getElementById('pieChart')
  const container = document.getElementById('container')
  Highcharts.chart('pieChart', {
    chart: {
      type: 'pie',
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label =
              chart.renderer.label(
                'Total<br/>' +
                '<strong>2 877 820</strong>'
              )
                .css({
                  color: '#000',
                  textAnchor: 'middle'
                })
                .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y = series.center[1] + chart.plotTop -
              (customLabel.attr('height') / 2);

          customLabel.attr({
            x,
            y
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`
          });
        }
      }
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    title: {
      text: '2023 Norway car registrations'
    },
    subtitle: {
      text: 'Source: <a href="https://www.ssb.no/transport-og-reiseliv/faktaside/bil-og-transport">SSB</a>'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 8,
        dataLabels: [{
          enabled: true,
          distance: 20,
          format: '{point.name}'
        }, {
          enabled: true,
          distance: -15,
          format: '{point.percentage:.0f}%',
          style: {
            fontSize: '0.9em'
          }
        }],
        showInLegend: true
      }
    },
    series: [{
      name: 'Registrations',
      colorByPoint: true,
      innerSize: '75%',
      data: [{
        name: 'EV',
        y: 23.9
      }, {
        name: 'Hybrids',
        y: 12.6
      }, {
        name: 'Diesel',
        y: 37.0
      }, {
        name: 'Petrol',
        y: 26.4
      }]
    }]
  });


  function mostarNomeH1() {
    const tipoConta = sessionStorage.getItem('TIPO_CONTA');
    const tipoContaTitulo = document.getElementById('tipoContaUsuarioTitulo');

    if (tipoConta === 'DIRETOR ACADEMICO') {
      userTypeText = 'Diretor';
    } else if (tipoConta === 'GESTOR') {
      userTypeText = 'Gestor';
    } else if (tipoConta === 'PESQUISADOR') {
      userTypeText = 'Pesquisador';
    }

    if (tipoContaTitulo) tipoContaTitulo.textContent = userTypeText;
  }