import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearProducto.css';
import { useAuth } from '../context/AuthContext';

const CrearProducto = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    medidas: '',
    materiales: '',
    acabado: '',
    caracteristicas: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoadingProductos(true);
      const url = `${API_BASE}/api/productos`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.statusText}`);
      }
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoadingProductos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError(null);
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) return 'El nombre es obligatorio';
    if (!formData.precio.trim() || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) return 'El precio debe ser un número válido mayor a 0';
    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) return 'El stock debe ser un número válido mayor o igual a 0';
    
    if (formData.imagen) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(formData.imagen.type)) return 'El archivo debe ser una imagen (JPG, PNG, GIF)';
      if (formData.imagen.size > 5 * 1024 * 1024) return 'El archivo no debe superar los 5MB';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validarFormulario();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if(key === 'precio' && formData[key]) formDataToSend.append(key, parseFloat(formData[key]));
        else if(key === 'stock' && formData[key]) formDataToSend.append(key, parseInt(formData[key]));
        else if(formData[key]) formDataToSend.append(key, formData[key]);
      });
      
      const url = `${API_BASE}/api/productos`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Error al crear el producto: ${response.statusText}`);
      }
      
      setFormData({
        nombre: '', descripcion: '', precio: '', stock: '', imagen: null,
        medidas: '', materiales: '', acabado: '', caracteristicas: ''
      });
      setImagePreview(null);
      setSuccess(true);
      await fetchProductos();
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (producto) => {
    if (!window.confirm(`¿Estás seguro que deseas eliminar "${producto.nombre}"?`)) return;
    
    try {
      const url = `${API_BASE}/api/productos/${producto._id}`;
      const response = await fetch(url, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Error al eliminar el producto');
      }
      
      setProductos(prev => prev.filter(p => p._id !== producto._id));
      alert('Producto eliminado exitosamente');
      
    } catch (error) {
      alert('Error al eliminar el producto: ' + error.message);
    }
  };

  return (
    <div className="crear-producto-page">
      <div className="formulario-seccion">
        <h1 className="titulo">Crear Nuevo Producto</h1>
        
        {success && <div className="mensaje-exito">¡Producto creado exitosamente!</div>}
        {error && <div className="mensaje-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="formulario">
          <div className="campo">
            <label htmlFor="nombre">Nombre *</label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          
          <div className="campo">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" />
          </div>
          
          <div className="campos-fila">
            <div className="campo">
              <label htmlFor="precio">Precio *</label>
              <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} step="0.01" min="0" required />
            </div>
            <div className="campo">
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" />
            </div>
          </div>
          
          <div className="campo">
            <label htmlFor="medidas">Medidas</label>
            <input type="text" id="medidas" name="medidas" value={formData.medidas} onChange={handleChange} />
          </div>
          
          <div className="campo">
            <label htmlFor="materiales">Materiales</label>
            <input type="text" id="materiales" name="materiales" value={formData.materiales} onChange={handleChange} />
          </div>
          
          <div className="campo">
            <label htmlFor="acabado">Acabado</label>
            <input type="text" id="acabado" name="acabado" value={formData.acabado} onChange={handleChange} />
  
          </div>
          
          <div className="campo">
            <label htmlFor="caracteristicas">Características</label>
            <textarea id="caracteristicas" name="caracteristicas" value={formData.caracteristicas} onChange={handleChange} rows="2" />
          </div>
          
          <div className="campo">
            <label htmlFor="imagen">Imagen del Producto</label>
            <input type="file" id="imagen" name="imagen" onChange={handleChange} accept="image/*" />
          </div>
          
          {imagePreview && (
            <div className="preview-imagen">
              <p>Vista previa:</p>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
          
          <button type="submit" className="btnCrear" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </form>
      </div>

      <div className="productos-seccion">
        <h2 className="subtitulo">Productos Existentes</h2>
        
        {loadingProductos ? <div className="loading">Cargando...</div> : 
         productos.length === 0 ? <div className="sin-productos">No hay productos.</div> : (
          <div className="productos-lista">
            {productos.map((producto) => (
              <div key={producto._id} className="producto-item">
                <div className="producto-imagen">
                  {producto.imagenUrl && 
                    <img src={producto.imagenUrl.startsWith('http') ? producto.imagenUrl : `${API_BASE}${producto.imagenUrl}`} alt={producto.nombre} />}
                </div>
                
                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-descripcion">{producto.descripcion || 'Sin descripción'}</p>
                  <div className="producto-detalles">
                    <span className="precio">${producto.precio?.toLocaleString()}</span>
                    <span className="stock">Stock: {producto.stock || 0}</span>
                  </div>
                </div>
                
                <div className="producto-acciones">
                  <button onClick={() => navigate(`/productos/${producto._id}`)} className="btnVer" title="Ver">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button onClick={() => eliminarProducto(producto)} className="btnEliminar" title="Eliminar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearProducto;