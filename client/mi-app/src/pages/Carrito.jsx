import { Link, useNavigate } from 'react-router-dom';
import './Carrito.css';

export default function Carrito({ carrito, eliminarDelCarrito, vaciarCarrito }) {
  const navigate = useNavigate();
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="carrito-page">
      <h1 className="titulo">Tu Carrito</h1>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((item) => (
              <div key={item._id} className="carrito-item">
                <div className="item-imagen">
                  <img src={item.imagenUrl} alt={item.nombre} />
                </div>
                <div className="item-info">
                  <h2 className="item-nombre">{item.nombre}</h2>
                  <p className="item-precio">${item.precio.toLocaleString()}</p>
                </div>
                <div className="item-cantidad">
                  <span>Cant: {item.cantidad}</span>
                </div>
                <div className="item-subtotal">
                  <p>${(item.precio * item.cantidad).toLocaleString()}</p>
                </div>
                <div className="item-acciones">
                  <button onClick={() => eliminarDelCarrito(item._id)} className="btn-eliminar">
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-total">
            <div className="total-texto">
              <p>Total:</p>
              <p className="total-monto">${total.toLocaleString()}</p>
            </div>
            <div className="total-acciones">
              <button onClick={() => vaciarCarrito()} className="btn btn-secundario">
                Vaciar Carrito
              </button>
              <button onClick={() => navigate('/checkout')} className="btn">
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
