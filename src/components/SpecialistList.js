import React from "react";
import "./SpecialistList.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const specialists = [
  { name: "Médicos", icon: "heart" }, // Corazón
  { name: "Odontología", icon: "brush" }, // Oído (Alternativo)
  { name: "Kinesiología", icon: "person-lines-fill" }, // Persona en movimiento
  { name: "Fonoaudiología", icon: "ear" }, // Oído
  { name: "Acompañante de Terapia", icon: "person-check" }, // Persona con check
  { name: "Enfermería", icon: "capsule" }, // Cápsula de medicamento
  { name: "Cuidador", icon: "people" }, // Corazón
  { name: "Laboratorio", icon: "capsule" }, // Frasco de laboratorio
  { name: "Radiología", icon: "image" }, // Imagen (rayos X)
  { name: "Radiología Domicilio", icon: "hospital" }, // Casa
  { name: "Farmacia", icon: "briefcase" }, // Botiquín
  { name: "Ortopédicas", icon: "cloud" }, // Nube (Oxígeno)
  { name: "Ambulancias de Traslado", icon: "truck" }, // Camión
  { name: "Traslados Aéreos Sanitarios", icon: "airplane-engines" }, // Avión
  { name: "Traslados Fluviales y Marítimos", icon: "truck" }, // Barco
  { name: "Centros de Salud", icon: "hospital" }, // Hospital
  { name: "Laboratorios Farmacéuticos", icon: "infinity " }, // Frasco de laboratorio
  { name: "Centros Radiológicos", icon: "camera-reels" }, // Cámara (radiología)
];

function SpecialistList() {
  return (
    <div className="specialist-list">
      <h2>Listado de Especialistas</h2>
      <div className="specialists-grid">
        {specialists.map((specialist, index) => (
          <div key={index} className="specialist">
            
            <i className={`bi bi-${specialist.icon} specialist-icon`}></i>
            <span>{specialist.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecialistList;
