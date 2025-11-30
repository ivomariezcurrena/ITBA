import './Navbar.css'
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ cantidadCarrito }) {
  const { isAuthenticated, user } = useAuth()

  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <h2>Hermanos Jota</h2>
      <ul>
        <li>
          <Link to="/productos">PRODUCTOS</Link>
        </li>
        <li>
          <Link to="/contacto">CONTACTO</Link>
        </li>
        <li>
          <Link to="#carrito">
            <i className="fa-solid fa-cart-shopping"></i>
            {cantidadCarrito > 0 && <span>{cantidadCarrito}</span>}
          </Link>
        </li>
        {/* Mostrar enlace admin sólo a usuarios autenticados con role 'admin' */}
        {isAuthenticated && user && user.role === 'admin' && (
          <li>
            <Link to="/admin/crear-producto">CREAR PRODUCTO</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

