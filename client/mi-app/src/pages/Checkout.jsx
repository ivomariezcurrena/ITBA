import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Checkout.css';
import ResumenPedido from '../components/ResumenPedido';

export default function Checkout({ carrito, total, vaciarCarrito }) {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Construir payload acorde al backend
      const items = carrito.map((item) => ({
        productId: item._id,
        cantidad: item.cantidad,
        precio: item.precio,
      }));

      const direccion = `${formData.direccion}, ${formData.ciudad} ${formData.codigoPostal}, ${formData.pais}`;

      const payload = { items, total, direccion };

      const created = await api.post('/orders', payload);
      console.log('Pedido creado:', created);
      setSuccess(true);
      vaciarCarrito();

      // Redirigir a mis pedidos
      navigate('/mis-pedidos');
    } catch (err) {
      console.error('Error creando pedido:', err);
      setError(err.message || 'Error al crear el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-page">
        <div className="checkout-form-container">
          <h1 className="titulo">¡Pedido Realizado!</h1>
          <p>Tu pedido ha sido procesado exitosamente y será enviado en breve.</p>
          <p>Redirigiendo a "Mis Pedidos"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-form-container">
        <h1 className="titulo">Finalizar Compra</h1>

        {error && <p className="mensaje-error">{error}</p>}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-seccion">
            <h2>Dirección de Envío</h2>
            <div className="campo">
              <label htmlFor="direccion">Dirección</label>
              <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="ciudad">Ciudad</label>
              <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="codigoPostal">Código Postal</label>
              <input type="text" id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="pais">País</label>
              <input type="text" id="pais" name="pais" value={formData.pais} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-seccion">
            <h2>Información de Pago (Simulado)</h2>
            <div className="campo">
              <label htmlFor="numeroTarjeta">Número de Tarjeta</label>
              <input type="text" id="numeroTarjeta" name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="fechaExpiracion">Fecha de Expiración</label>
              <input type="text" id="fechaExpiracion" name="fechaExpiracion" placeholder="MM/AA" value={formData.fechaExpiracion} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-confirmar" disabled={loading || carrito.length === 0}>
            {loading ? 'Procesando...' : `Confirmar Pedido - $${total.toLocaleString()}`}
          </button>
        </form>
      </div>
      
      <ResumenPedido carrito={carrito} total={total} />
    </div>
  );
}
