import ModalEliminar from '../components/ModalEliminar';
import './detalle.css'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DetallePage({producto, volver, agregarAlCarrito}){
    const [showmodal, setShowmodal] = useState(false);
    const navigate = useNavigate();

  const { token, user } = useAuth();
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const imagenPath = producto.imagenUrl
    ? producto.imagenUrl.match(/^https?:\/\//i)
      ? producto.imagenUrl
      : `${API_BASE}${producto.imagenUrl.startsWith('/') ? '' : '/'}${producto.imagenUrl}`
    : null

    function handlerModal(){
        setShowmodal(!showmodal);
    }

    const handleEliminar = async (productoId) => {
      try {
        const url = `${API_BASE}/api/productos/${productoId}`;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(url, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          const ct = response.headers.get('content-type') || '';
          let errMsg = `Error al eliminar el producto: ${response.status} ${response.statusText}`;
          if (ct.includes('application/json')) {
            const errData = await response.json().catch(() => null);
            if (errData && errData.error) errMsg = errData.error;
          }
          throw new Error(errMsg);
        }

        alert('Producto eliminado exitosamente');
        setShowmodal(false);
        navigate('/productos');

      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto: ' + error.message);
      }
    };
    return(
        <>
        <div className="Detalle">
            <button className='btnVolver' onClick={volver} title="Volver">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="imagen">
            {imagenPath && (
                <img src={imagenPath} alt={producto.nombre} className="card-image" />
            )}
            </div>
            <div className="descripcion">
                <h1 className="titulo">{producto.nombre}</h1>
                <p>{producto.descripcion}</p>
                <div className="detalles">
                    <div>
                        <h3>Medidas</h3>
                        <p>{producto.medidas || 'No especificado'}</p>
                    </div>
                    <div>
                        <h3>Materiales</h3>
                        <p>{producto.materiales || 'No especificado'}</p>
                    </div>
                    <div>
                        <h3>Acabado</h3>
                        <p>{producto.acabado || 'No especificado'}</p>
                    </div>
                    <div>
                        <h3>Características</h3>
                        <p>{producto.caracteristicas || 'No especificado'}</p>
                    </div>
                </div>
                <div className='acciones'>
                    <button className='btnCarrito' onClick={() => agregarAlCarrito(producto)}>Añadir al carrito</button>
                    {/* Mostrar botón Eliminar sólo a admins */}
                    {user && user.role === 'admin' && (
                      <button className='btnEliminar' onClick={()=> handlerModal()}>Eliminar</button>
                    )}
                </div>
            </div>
        </div>
        {showmodal && (
            <ModalEliminar
                abierto={showmodal}
                onClose={handlerModal}
                onConfirm={handleEliminar}
                producto={producto}
            />
        )}
        </>
    )
}