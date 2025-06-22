// ======================
// Основные функции портала
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темной/светлой темы
    initTheme();
    
    // Загрузка данных пользователя
    loadUserData();
    
    // Инициализация Dashboard
    initDashboard();
    
    // Обработчики событий
    setupEventListeners();
});

// ======================
// Работа с темой (dark/light)
// ======================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Проверка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    html.classList.toggle('dark', savedTheme === 'dark');
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// ======================
// Загрузка данных пользователя
// ======================

async function loadUserData() {
    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        
        const userData = await response.json();
        
        // Обновляем интерфейс
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userPosition').textContent = userData.position;
        document.getElementById('userAvatar').src = userData.avatar || '/images/default-avatar.jpg';
        
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Не удалось загрузить данные пользователя', 'error');
    }
}

// ======================
// Dashboard и KPI
// ======================

async function initDashboard() {
    // Загрузка KPI данных
    const kpiData = await fetchKPIData();
    
    // Инициализация графиков
    if (window.Chart) {
        renderKPICarts(kpiData);
    }
    
    // Загрузка уведомлений
    loadNotifications();
}

async function fetchKPIData() {
    try {
        const response = await fetch('/api/kpi');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки KPI:', error);
        return { error: true };
    }
}

function renderKPICarts(data) {
    if (data.error) return;
    
    const ctx = document.getElementById('kpiChart');
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Показатели эффективности',
                data: data.values,
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ======================
// Уведомления
// ======================

async function loadNotifications() {
    try {
        const response = await fetch('/api/notifications');
        const notifications = await response.json();
        
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
                <p class="notification-title">${notif.title}</p>
                <p class="notification-text">${notif.message}</p>
                <span class="notification-time">${formatTime(notif.time)}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error);
    }
}

// ======================
// Вспомогательные функции
// ======================

function setupEventListeners() {
    // Мобильное меню
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Выход из системы
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function showNotification(message, type = 'info') {
    // Реализация показа уведомлений
    const types = {
        info: 'bg-blue-100 text-blue-800',
        error: 'bg-red-100 text-red-800',
        success: 'bg-green-100 text-green-800'
    };
    
    const notification = document.createElement('div');
    notification.className = `p-4 mb-4 rounded-lg ${types[type]}`;
    notification.textContent = message;
    
    const container = document.getElementById('notifications');
    if (container) {
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// ======================
// WebSocket соединение
// ======================

function connectWebSocket() {
    const socket = new WebSocket(`wss://${window.location.host}/ws`);
    
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
            showNotification(data.message, data.level || 'info');
        }
    };
    
    socket.onclose = function() {
        setTimeout(connectWebSocket, 5000); // Переподключение через 5 сек
    };
}

// Инициализация WebSocket при загрузке
if (window.WebSocket) {
    connectWebSocket();
}