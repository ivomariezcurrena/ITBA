const jwt = require('jsonwebtoken');
const User = require('../Models/User');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Formato de token inválido' });

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no definido en .env');
      return res.status(500).json({ error: 'Configuración del servidor incompleta' });
    }

    jwt.verify(token, secret, async (err, payload) => {
      if (err) return res.status(401).json({ error: 'Token inválido' });

      // Opcional: cargar usuario desde BD para obtener rol y estado
      try {
        const user = await User.findById(payload.id).select('-password');
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
        req.user = user;
        next();
      } catch (e) {
        next(e);
      }
    });
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado: admin requerido' });
  next();
}

module.exports = { authenticateToken, requireAdmin };