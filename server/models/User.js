// server/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'employee' },
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;
require('dotenv').config(); // подключаем .env
const sequelize = require('./database');

// после app.listen
sequelize.authenticate()
  .then(() => console.log('База данных подключена'))
  .catch(err => console.error('Ошибка подключения к БД:', err));

