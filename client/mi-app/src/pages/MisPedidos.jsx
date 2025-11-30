import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './MisPedidos.css';


const getImageUrl = (path) => {
  if (!path) return null;
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
  if (path.match(/^https?:\/\//i)) {
    return path;
  }
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('Debes iniciar sesión para ver tus pedidos.');
      return;
    }

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await api.get('/orders');
        setPedidos(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  if (loading) {
    return <main style={{ padding: '2rem', textAlign: 'center' }}>Cargando pedidos...</main>;
  }

  if (error) {
    return <main style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</main>;
  }

  return (
    <div className="mis-pedidos-container">
      <h1 className="PageTitulo">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No has realizado ningún pedido todavía.</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="order-card">
              <div className="order-header">
                <h2>Pedido #{pedido._id.substring(0, 7)}</h2>
                <span className="order-status">{pedido.estado}</span>
              </div>
              <div className="order-details">
                <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
                <p><strong>Dirección:</strong> {pedido.direccion || 'No especificada'}</p>
              </div>

              <div className="order-items-list">
                <h3>Artículos</h3>
                {pedido.items.map((item) => (
                  <div key={item.productId?._id || item._id} className="order-item">
                    <img 
                      src={getImageUrl(item.productId?.imagenUrl)} 
                      alt={item.productId?.nombre} 
                      className="order-item-img"
                    />
                    <div className="order-item-info">
                      <h4>{item.productId?.nombre || 'Producto no disponible'}</h4>
                      <p>Cantidad: {item.cantidad}</p>
                      <p>Precio unitario: ${item.precio.toFixed(2)}</p>
                    </div>
                    <div className="order-item-price">
                      ${(item.cantidad * item.precio).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <p className="order-total">Total del Pedido: ${pedido.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
