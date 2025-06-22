const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// ⬇️ Подключение к базе данных
const sequelize = require('./database');
(async () => {
  try {
    await sequelize.sync(); // создаёт таблицы, если их нет
    console.log('База данных подключена');
  } catch (error) {
    console.error('Ошибка подключения к базе:', error);
  }
})();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Новое подключение');
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
const socket = io();

// Подключение при авторизации
socket.emit('join', currentUserId);

// Получение уведомлений
socket.on('notification', (data) => {
  showNotification(data.message);
});