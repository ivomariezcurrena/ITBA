import { useEffect, useState } from "react";
import ProductList from "../productos/ProductList";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Normalizar VITE_API_URL y fallback a backend local en desarrollo
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const url = `${API_BASE}/api/productos`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          // intentar leer body para mensaje de error
          let text = await res.text().catch(() => null);
          throw new Error(`Error al obtener productos: ${res.status} ${res.statusText}${text ? ' - ' + text : ''}`);
        }

        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          return res.json();
        }

        // Si no es JSON, leer como texto para ayudar al debugging (p.ej. HTML de Vite)
        const txt = await res.text().catch(() => null);
        throw new Error('Respuesta inesperada del servidor (no JSON): ' + (txt ? txt.substring(0, 300) : 'sin cuerpo'));
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message || 'Error desconocido'))
      .finally(() => setLoading(false));
  }, []);

  const verDetalle = (producto) => {};

  return (
    <ProductList
      productos={productos}
      loading={loading}
      error={error}
      verDetalle={verDetalle}
    />
  );
};

export default Productos;
