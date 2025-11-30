import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DetallePage from "../productos/detalle/Detalle";

const ProductoDetalle = ({ agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Cargando detalle del producto con ID:", id);
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const url = `${API_BASE}/api/productos/${id}`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          let txt = await res.text().catch(() => null);
          throw new Error(`No se pudo cargar el producto: ${res.status} ${res.statusText}${txt ? ' - ' + txt : ''}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          return res.json();
        }
        const txt = await res.text().catch(() => null);
        throw new Error('Respuesta inesperada del servidor (no JSON): ' + (txt ? txt.substring(0, 300) : 'sin cuerpo'));
      })
      .then(data => setProducto(data))
      .catch((err) => {
        console.error('Error cargando producto:', err);
        setProducto(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <DetallePage
      producto={producto}
      volver={() => navigate(-1)}
      agregarAlCarrito={agregarAlCarrito}
    />
  );
};

export default ProductoDetalle;
