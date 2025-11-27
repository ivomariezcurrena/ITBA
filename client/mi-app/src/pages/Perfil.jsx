import React from "react";

const Perfil = () => {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mi Perfil</h1>

      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">Información del Usuario</h5>

        <div className="mb-2">
          <strong>Nombre:</strong> {user?.nombre || "Usuario invitado"}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user?.email || "No especificado"}
        </div>
        <div className="mb-2">
          <strong>Teléfono:</strong> {user?.telefono || "No especificado"}
        </div>

        <button className="btn btn-danger mt-4" disabled>
          Cerrar Sesión (próximamente)
        </button>
      </div>
    </div>
  );
};

export default Perfil;

