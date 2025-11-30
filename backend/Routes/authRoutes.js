const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const router = express.Router();

// Registro
router.post('/registro', async (req, res, next) => {
  try {
    const { email, password, nombre, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const userRole = role ?? 'user';

    // Por seguridad, siempre crear usuarios con rol 'user' desde el registro público
    const user = new User({ email: email.toLowerCase().trim(), password: hashed, nombre, role: userRole });
    const saved = await user.save();

    const userSafe = { id: saved._id, email: saved.email, nombre: saved.nombre, role: saved.role, createdAt: saved.createdAt };
    res.status(201).json(userSafe);
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no definido en .env');
      return res.status(500).json({ error: 'Configuración del servidor incompleta' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email, nombre: user.nombre, role: user.role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
