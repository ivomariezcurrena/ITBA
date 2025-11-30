const express = require("express");
const cors = require("cors");
const chalk = require("chalk");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/db");
const productRoutes = require("./Routes/productRoutes");
const authRoutes = require("./Routes/authRoutes");
const orderRoutes = require("./Routes/orderRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use(cors());
app.use(express.json());

// servir imagenes
app.use('/img', express.static(path.join(__dirname, 'img')));


app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/productos/', productRoutes);
app.use('/api', authRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

// manejador de errores
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Error interno del servidor" });
});

// iniciar servidor
let server;
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no definido en .env");
    }
    await db.connect(MONGO_URI);
    server = app.listen(PORT, () => {
      console.log(chalk.yellow(`API escuchando en http://localhost:${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red("Error iniciando la app:"), err);
    process.exit(1);
  }
}

startServer();

// manejo de cierre
async function shutdown(signal) {
  console.log(chalk.blue(`Recibido ${signal}, cerrando...`));
  try {
    if (server) {
      server.close(() => {
        console.log("Servidor HTTP cerrado");
      });
    }
    await db.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error durante shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = app;
