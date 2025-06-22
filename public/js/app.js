// Отправка формы входа
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('token', token);
    window.location.href = '/dashboard';
  } else {
    alert('Ошибка входа!');
  }
});
const sequelize = require('./database');
sequelize.sync(); // добавь перед запуском сервера
// Получение данных KPI
async function fetchKPIData() {
  const response = await fetch('/api/kpi');
  return await response.json();
}

// Отрисовка графиков
async function renderCharts() {
  const data = await fetchKPIData();
  
  const ctx = document.getElementById('kpiChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [{
        label: 'On-Time Delivery %',
        data: data.performance,
        borderColor: '#3B82F6',
        tension: 0.1
      }]
    }
  });
}

// Вызов при загрузке страницы
document.addEventListener('DOMContentLoaded', renderCharts);