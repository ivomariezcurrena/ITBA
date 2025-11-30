import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Contacto from './pages/Contacto'
import CrearProducto from './pages/Crear-Producto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import { useAuth } from './context/AuthContext'
import RequireAdmin from './components/RequireAdmin'

function App() {
  const { isAuthenticated } = useAuth()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cantidadCarrito, setCantidadCarrito] = useState(0)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/productos`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos')
        return res.json()
      })
      .then((data) => {
        setProductos(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const agregarAlCarrito = (producto) => {
    if (producto) setCantidadCarrito(cantidadCarrito + 1)
  }

  return (
    <BrowserRouter>
      {/* Mostrar Navbar sólo si el usuario está autenticado */}
      {isAuthenticated && <Navbar cantidadCarrito={cantidadCarrito} />}

      <main>
        {/* Si no está autenticado, exponer únicamente login/registro y forzar redirect */}
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route
              path="/productos/:id"
              element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} />}
            />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/registro" element={<Navigate to="/" replace />} />
            <Route
              path="/admin/crear-producto"
              element={
                <RequireAdmin>
                  <CrearProducto />
                </RequireAdmin>
              }
            />
          </Routes>
        )}
      </main>

      {/* Mostrar Footer sólo si el usuario está autenticado */}
      {isAuthenticated && <Footer />}
    </BrowserRouter>
  )
}

export default App


