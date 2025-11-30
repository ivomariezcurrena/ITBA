import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Perfil.css';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <div className="perfil-avatar">
          {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="perfil-info">
          <h1>{user?.nombre || 'Usuario'}</h1>
          <p>{user?.email || 'email@example.com'}</p>
        </div>
      </div>

      <div className="perfil-seccion">
        <h2>Mis Pedidos</h2>
        <p>Aquí se mostrará el historial de pedidos.</p>
      </div>

      <div className="perfil-seccion">
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
