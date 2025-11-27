import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Contacto from './pages/Contacto'
import CrearProducto from './pages/Crear-Producto'
import Perfil from './pages/Perfil'


function App() {
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
      <Navbar cantidadCarrito={cantidadCarrito} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route
            path="/productos/:id"
            element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin/crear-producto" element={<CrearProducto />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App


