const ctx = document.getElementById('kpiChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Янв', 'Фев', 'Мар'],
    datasets: [{
      label: 'Производительность',
      data: [75, 90, 80],
      backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
  }
});
