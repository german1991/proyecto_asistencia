import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const isProfileValidated = false; // Cambia esto según la lógica real de tu aplicación

  const handleNavigateToPrestador = () => {
    console.log("Redirigiendo al formulario de perfil del prestador...");
    navigate("/prestador");
  };

  const handleValidateProfile = () => {
    if (!isProfileValidated) {
      alert("El perfil no está validado. Por favor, completa el perfil antes de continuar.");
      return;
    }
    console.log("Validando el perfil...");
    navigate("/validar-perfil");
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      <p>Desde aquí puedes gestionar tu perfil y completar la información requerida.</p>

      <button
        onClick={handleNavigateToPrestador}
        className="btn btn-primary dashboard-button"
      >
        Completar Perfil de Prestador
      </button>

      <button
        onClick={handleValidateProfile}
        className="btn btn-secondary dashboard-button"
      >
        Validar Perfil
      </button>
    </div>
  );
}

export default Dashboard;
