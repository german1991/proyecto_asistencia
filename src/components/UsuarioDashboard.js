import React from "react";
import { useNavigate } from "react-router-dom";
import "./UsuarioDashboard.css";
import "./HistorialConsultas"

function Dashboard() {
  const navigate = useNavigate();

  const handleNavigateToBuscarProfesionales = () => {
    console.log("Redirigiendo a buscar profesionales...");
    navigate("/buscar-profesionales");
  };

  const handleNavigateToMisTurnos = () => {
    // Redirige a la página de "Próximamente"
    navigate('/proximamente'); // Asegúrate de que esta ruta esté configurada en tu archivo de rutas
  };

  const handleNavigateToHistorialConsultas = () => {
    
    navigate('/proximamente');
  };
  
  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard USUARIO</h1>
      <p>Desde aquí puedes gestionar tus turnos, buscar profesionales y consultar tu historial médico.</p>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Buscar Profesionales</h3>
          <p>Accede a filtros avanzados para encontrar el profesional que necesitas.</p>
          <button
            onClick={handleNavigateToBuscarProfesionales}
            className="btn btn-primary dashboard-button"
          >
            Buscar Profesionales
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Mis Turnos</h3>
          <p>Visualiza los turnos que tienes reservados y cancela si es necesario.</p>
          <button
            onClick={handleNavigateToMisTurnos}
            className="btn btn-secondary dashboard-button"
          >
            Ver Mis Turnos
          </button>
        </div>

        <div className="dashboard-section">
            <h3>Historial de Consultas</h3>
            <p>Consulta un resumen de médicos visitados y evaluaciones realizadas.</p>
         <button
            onClick={handleNavigateToHistorialConsultas}
            className="btn btn-secondary dashboard-button"
        >
            Ver Historial
        </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
