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
import Perfil from './pages/Perfil'
import MisPedidos from './pages/MisPedidos'
import Checkout from './pages/Checkout'
import Carrito from './pages/Carrito'
import { useAuth } from './context/AuthContext'
import AdminPedidos from './pages/AdminPedidos'
import RequireAdmin from './components/RequireAdmin'
import RequireAuth from './components/RequireAuth'

function App() {
  const { isAuthenticated } = useAuth()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [carrito, setCarrito] = useState([])

  const cantidadCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0)
  const totalCarrito = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);


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
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item._id === producto._id)
      if (productoExistente) {
        return prevCarrito.map((item) =>
          item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }]
      }
    })
  }

  const eliminarDelCarrito = (productoId) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item._id !== productoId))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar cantidadCarrito={cantidadCarrito} vaciarCarrito={vaciarCarrito} />}

      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/productos" element={<Productos />} />
          <Route
            path="/productos/:id"
            element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route path="/contacto" element={<Contacto />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/perfil"
            element={
              <RequireAuth>
                <Perfil />
              </RequireAuth>
            }
          />
          <Route
            path="/mis-pedidos"
            element={
              <RequireAuth>
                <MisPedidos />
              </RequireAuth>
            }
          />
          <Route
            path="/carrito"
            element={
              <RequireAuth>
                <Carrito
                  carrito={carrito}
                  eliminarDelCarrito={eliminarDelCarrito}
                  vaciarCarrito={vaciarCarrito}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout carrito={carrito} total={totalCarrito} vaciarCarrito={vaciarCarrito} />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/crear-producto"
            element={
              <RequireAdmin>
                <CrearProducto />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <RequireAdmin>
                <AdminPedidos />
              </RequireAdmin>
            }
          />

          <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </BrowserRouter>
  )
}

export default App

