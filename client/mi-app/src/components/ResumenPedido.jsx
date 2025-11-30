import React from 'react';
import './ResumenPedido.css';

export default function ResumenPedido({ carrito, total }) {
  return (
    <div className="resumen-pedido">
      <h3>Resumen del Pedido</h3>
      <div className="resumen-items">
        {carrito.map(item => (
          <div key={item._id} className="resumen-item">
            <div className="item-info">
              <span className="item-nombre">{item.nombre}</span>
              <span className="item-cantidad">x{item.cantidad}</span>
            </div>
            <span className="item-precio">${(item.precio * item.cantidad).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="resumen-total">
        <span>Total</span>
        <span className="total-monto">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}
