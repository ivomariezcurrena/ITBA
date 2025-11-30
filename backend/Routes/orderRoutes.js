const express = require('express');
const Order = require('../Models/Order');
const Product = require('../Models/Product');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Crear pedido (protegido)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user; // set by authenticateToken
    if (!user) return res.status(401).json({ error: 'No autenticado' });

    const { items, direccion } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items del pedido requeridos' });
    }

    // Calcular total simple: sumar cantidad * precio (si precio no viene, intentar recuperar del producto)
    let total = 0;
    const processedItems = [];

    for (const it of items) {
      const { productId, cantidad } = it;
      if (!productId || !cantidad) {
        return res.status(400).json({ error: 'Cada item necesita productId y cantidad' });
      }

      // Intentar obtener precio desde Product si no viene
      let precio = it.precio;
      if (!precio) {
        const prod = await Product.findById(productId).select('precio');
        precio = prod ? prod.precio || 0 : 0;
      }

      const itemTotal = cantidad * Number(precio || 0);
      total += itemTotal;
      processedItems.push({ productId, cantidad, precio });
    }

    const order = new Order({ user: user._id, items: processedItems, total, direccion });
    const saved = await order.save();

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// Obtener pedidos del usuario autenticado
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id }).populate('items.productId', 'nombre precio');
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
