import React from "react";
import { useNavigate } from "react-router-dom";
import "./PrestadorDashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const isSubscriptionActive = false; // Simula el estado de la suscripción

  const handleNavigateToProfile = () => {
    console.log("Redirigiendo a la edición del perfil profesional...");
    navigate("/perfil-profesional");
  };

  const handleGoToSubscription = () => {
    navigate("/pagar-suscripcion"); // Redirige a PagarSuscripcion
  };

  const handleConfigureAgenda = () => {
    if (!isSubscriptionActive) {
      alert(
        "Tu suscripción no está activa. Por favor, abona tu suscripción para habilitar la agenda."
      );
      navigate("/pagar-suscripcion"); // Redirige a la página de pago
      return;
    }
    console.log("Redirigiendo a la configuración de la agenda...");
    navigate("/configurar-agenda");
  };

  const handleManageSubscriptions = () => {
    if (!isSubscriptionActive) {
      alert(
        "Tu suscripción no está activa. Por favor, abona tu suscripción para habilitar la agenda."
      );
      navigate("/pagar-suscripcion"); // Redirige a la página de pago
      return;
    }
    console.log("Redirigiendo a la gestión de suscripciones...");
    navigate("/suscripciones");
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard PRESTADOR</h1>
      <p>
        Desde aquí puedes gestionar tu perfil y completar la información
        requerida.
      </p>

      <div className="dashboard-sections">
        <h2>Secciones:</h2>

        {/* Turnos Pendientes */}
        <div className="dashboard-section">
          <h3>Turnos Pendientes</h3>
          <p>Listado de turnos próximos, con opciones para confirmar o cancelar.</p>
          <button className="btn btn-info dashboard-button">
            Ver Turnos Pendientes
          </button>
        </div>

        {/* Listado de Pacientes */}
        <div className="dashboard-section">
          <h3>Listado de Pacientes</h3>
          <p>Detalle de pacientes asociados a sus turnos.</p>
          <button className="btn btn-info dashboard-button">
            Ver Listado de Pacientes
          </button>
        </div>

        {/* Perfil Profesional */}
        <div className="dashboard-section">
          <h3>Perfil Profesional</h3>
          <p>
            Información validada por SISA, editable según sea necesario.
          </p>
          <button
            className="btn btn-info dashboard-button"
            onClick={handleNavigateToProfile}
          >
            Perfil Profesional
          </button>
        </div>

        {/* Configuración de Agenda */}
        <div className="dashboard-section">
          <h3>Configuración de Agenda</h3>
          <p>Modificación de horarios y disponibilidad.</p>
          <button
            className="btn btn-info dashboard-button"
            onClick={handleConfigureAgenda}
          >
            Configurar Agenda
          </button>
        </div>

        {/* Gestión de Suscripciones */}
        <div className="dashboard-section">
          <h3>Gestión de Suscripciones</h3>
          <p>
            Consulta el estado de tu suscripción o realiza el pago para habilitar
            la configuración de la agenda.
          </p>
          <button
            className="btn btn-info dashboard-button"
            onClick={handleGoToSubscription}
          >
            Gestionar Suscripciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
