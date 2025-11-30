const Product = require('../Models/Product');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../img'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res, next) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id);

        if(!product){
            const error = new Error("Producto no encontrado.");
            error.status = 404;
            return next(error);
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// POST con imagen
// Crear producto (solo admin)
router.post('/', authenticateToken, requireAdmin, upload.single('imagen'), async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock, imagenUrl: imagenUrlBody, medidas, materiales, acabado, caracteristicas } = req.body;
    let imagenUrl = '';
    if (req.file) {
      imagenUrl = `/img/${req.file.filename}`;
    } else if (imagenUrlBody) {
      imagenUrl = imagenUrlBody;
    }

    const newProduct = new Product({
      nombre,
      descripcion,
      precio,
      stock,
      imagenUrl,
      medidas,
      materiales,
      acabado,
      caracteristicas
    });

    const productCreated = await newProduct.save();
    res.status(201).json(productCreated);
  } catch (error) {
    next(error);
  }
});

// Modificar producto (solo admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    const productNewData = req.body;
    try {
        const productUpdated = await Product.findByIdAndUpdate(
            id,
            productNewData,
            { new: true, runValidators: true }
        );

        if (!productUpdated){
            const error = new Error("No se pudo modificar el producto.");
            error.status = 404;
            return next(error);
        }

        res.status(200).json(productUpdated);
    } catch (error) {
        next(error);
    }
});

// Eliminar producto (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    try {
        const productDeleted = await Product.findByIdAndDelete(id);
        
        if(!productDeleted){
            const error = new Error("No se pudo eliminar el producto.");
            error.status = 404;
            return next(error);
        }
        res.status(200).json(productDeleted);
    } catch (error) {
        next(error);
    }
});

module.exports = router;