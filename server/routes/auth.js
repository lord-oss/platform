const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const user = await User.create({ name, email, password, department });
    const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
    res.json({ token });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Неверный пароль' });

    const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
    res.json({ token });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

module.exports = router;

