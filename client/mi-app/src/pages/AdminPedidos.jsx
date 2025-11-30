import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './MisPedidos.css'; 
import './AdminPedidos.css';

const OrderStatusSelector = ({ currentStatus, orderId, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setStatus(updatedOrder.estado);
      onStatusChange(orderId, updatedOrder.estado);
    } catch (err) {
      setError('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-selector">
      <select value={status} onChange={handleChange} disabled={loading} className="status-select">
        <option value="pendiente">Pendiente</option>
        <option value="procesando">Procesando</option>
        <option value="enviado">Enviado</option>
        <option value="cancelado">Cancelado</option>
      </select>
      {loading && <span className="status-loading">...</span>}
      {error && <span className="status-error">{error}</span>}
    </div>
  );
};


export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPedidos = async () => {
      try {
        setLoading(true);
        const data = await api.get('/orders/all');
        setPedidos(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar todos los pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPedidos();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setPedidos(pedidos.map(p => p._id === orderId ? { ...p, estado: newStatus } : p));
  };

  if (loading) {
    return <main style={{ padding: '2rem', textAlign: 'center' }}>Cargando todos los pedidos...</main>;
  }

  if (error) {
    return <main style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</main>;
  }

  return (
    <div className="mis-pedidos-container">
      <h1 className="PageTitulo">Administración de Pedidos</h1>
      {pedidos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay pedidos para mostrar.</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="order-card">
              <div className="order-header">
                <h2>Pedido #{pedido._id.substring(0, 7)}</h2>
                <OrderStatusSelector 
                  currentStatus={pedido.estado}
                  orderId={pedido._id}
                  onStatusChange={handleStatusChange}
                />
              </div>
              <div className="order-details">
                <p><strong>Usuario:</strong> {pedido.user?.email || 'N/A'}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
                <p><strong>Dirección:</strong> {pedido.direccion || 'No especificada'}</p>
              </div>

              <div className="order-items-list">
                <h3>Artículos</h3>
                {pedido.items.map((item) => (
                  <div key={item.productId?._id || item._id} className="order-item">
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
