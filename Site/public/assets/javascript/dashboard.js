
const ctx1 = document.getElementById('ChartOne');

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Red', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: '#800000', // Azul com 50% de opacidade
            borderColor: 'rgba(14, 48, 71, 0)', // Cor da borda sólida
            borderWidth: 2 //

      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const ctx2 = document.getElementById('ChartTwo');

  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });