import React from "react";
import "./PersonalRecommendations.css";

function PersonalRecommendations() {
  return (
    <div className="recommendations">
      <h2>Recomendaciones personales</h2>
      <div className="recommendations-grid">
        <div className="recommendation">
          <h3>Cardiología y electrocardiograma</h3>
          <p>Agenda una consulta cardiológica en tu domicilio.</p>
        </div>
        <div className="recommendation">
          <h3>Farmacia</h3>
          <p>
            Solicita medicamentos, consulta disponibilidad y recibe asesoramiento farmacéutico personalizado.
          </p>
        </div>
        <div className="recommendation">
          <h3>Cuidadores</h3>
          <p>
            Obtén cuidados personalizados para tus seres queridos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonalRecommendations;
