import './Navbar.css'
import logo from '../assets/logo.svg'
import { Link } from 'react-router-dom'

function Navbar({ cantidadCarrito }) {
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
        <li>
          <Link to="/admin/crear-producto">CREAR PRODUCTO</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/perfil">MI PERFIL</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

