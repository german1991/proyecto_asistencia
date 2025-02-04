import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PrestadorDashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);

  useEffect(() => {
    handleGoToSubscription(); 
  }, []);

  const handleGoToSubscription = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Por favor, inicia sesión primero.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/subscription-status", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      setSuscripcionActiva(data.suscripcion_activa || false);
    } catch (error) {
      console.error("Error al consultar la suscripción:", error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/perfil-profesional");
  };

  const handleConfigureCalendario = () => {
    navigate("/calendario"); 
  };


  const handleConfigureAgenda = () => {
    if (!suscripcionActiva) {
      alert("Tu suscripción no está activa. Por favor, abona tu suscripción para habilitar la agenda.");
      navigate("/pagar-suscripcion");
      return;
    }
    navigate("/configurar-agenda");
  };

  const handleManageSubscriptions = () => {
    if (!suscripcionActiva) {
      alert("Tu suscripción no está activa. Por favor, abona tu suscripción para habilitar la agenda.");
      navigate("/pagar-suscripcion");
      return;
    }
    navigate("/suscripciones");
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard PRESTADOR</h1>
      <p>Desde aquí puedes gestionar tu perfil y completar la información requerida.</p>

      <div className="dashboard-sections">
        <h2>Secciones:</h2>

        <div className="dashboard-section">
          <h3>Perfil Profesional</h3>
          <button className="btn btn-info dashboard-button" onClick={handleNavigateToProfile}>
            Perfil Profesional
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Configuración de Agenda</h3>
          <button className="btn btn-info dashboard-button" onClick={handleConfigureCalendario}>
            Configurar Agenda
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Gestión de Suscripciones</h3>
          <p>{suscripcionActiva ? "✅ Suscripción activa" : "Tu suscripción no está activa."}</p>
          <button className="btn btn-info dashboard-button" onClick={handleGoToSubscription}>
            Gestionar Suscripciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
