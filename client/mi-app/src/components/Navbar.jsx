import { useState } from 'react'
import './Navbar.css'
import logo from '../assets/logo.svg'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ cantidadCarrito, vaciarCarrito }) {
  const { isAuthenticated, user, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const closeMenu = () => {
    setMenuAbierto(false)
  }

  const handleLogout = () => {
    logout()
    vaciarCarrito()
    closeMenu()
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        <img src={logo} alt="logo" />
        <h2>Hermanos Jota</h2>
      </Link>

      <button className="menu-hamburguesa" onClick={toggleMenu}>
        <i className={`fa-solid ${menuAbierto ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>
      
      <ul className={`navegacion ${menuAbierto ? 'abierto' : ''}`}>
        <li>
          <NavLink to="/productos" onClick={closeMenu}>Productos</NavLink>
        </li>
        <li>
          <NavLink to="/contacto" onClick={closeMenu}>Contacto</NavLink>
        </li>
        
        {isAuthenticated && user?.role === 'admin' && (
          <>
            <li><NavLink to="/admin/crear-producto" onClick={closeMenu}>Crear Producto</NavLink></li>
            <li><NavLink to="/admin/pedidos" onClick={closeMenu}>Admin Pedidos</NavLink></li>
          </>
        )}
        
        {isAuthenticated && user?.role !== 'admin' && (
          <li><NavLink to="/mis-pedidos" onClick={closeMenu}>Mis Pedidos</NavLink></li>
        )}

        {isAuthenticated && (
          <li><NavLink to="/perfil" onClick={closeMenu}>Mi Perfil</NavLink></li>
        )}
        
        <li>
          <NavLink to="/carrito" className="cart-link" onClick={closeMenu}>
            <i className="fa-solid fa-cart-shopping"></i>
            {cantidadCarrito > 0 && <span className="cart-badge">{cantidadCarrito}</span>}
          </NavLink>
        </li>

        {isAuthenticated ? (
          <li>
            <button className="link-button logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
            <li><NavLink to="/registro" onClick={closeMenu}>Registro</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
