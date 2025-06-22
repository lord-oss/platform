const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Роуты
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Подключение к БД
const sequelize = require('./database');
(async () => {
  try {
    await sequelize.sync();
    console.log('База данных подключена');
  } catch (error) {
    console.error('Ошибка подключения к базе:', error);
  }
})();

// WebSocket
io.on('connection', (socket) => {
  console.log('Новое подключение');

  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

// Один запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

