const express = require('express');
const Order = require('../Models/Order');
const Product = require('../Models/Product');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();


router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const user = req.user; // set by authenticateToken
    if (!user) return res.status(401).json({ error: 'No autenticado' });

    const { items, direccion } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items del pedido requeridos' });
    }


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
    // Si el usuario es admin, devolver solo sus pedidos (ruta /all ofrece todos)
    const orders = await Order.find({ user: user._id })
      .populate('items.productId', 'nombre precio imagenUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Obtener todos los pedidos (solo admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'email nombre role').populate('items.productId', 'nombre precio');
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Actualizar estado de un pedido (solo admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pendiente', 'procesando', 'enviado', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { estado: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
