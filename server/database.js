const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // можно указать любой путь
});

sequelize.authenticate()
  .then(() => console.log('База данных подключена'))
  .catch(err => console.error('Ошибка подключения к БД:', err));

module.exports = sequelize;
