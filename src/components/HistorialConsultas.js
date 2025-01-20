import React, { useState } from "react";
import "./HistorialConsultas.css";
import { useNavigate } from "react-router-dom";

function HistorialConsultas() {
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([
    { id: 1, fecha: "2025-01-01", profesional: "Dr. Juan Pérez", tipo: "Consulta General", estado: "Completada" },
    { id: 2, fecha: "2025-01-02", profesional: "Dra. Ana López", tipo: "Consulta Odontológica", estado: "Cancelada" },
    { id: 3, fecha: "2025-01-03", profesional: "Dr. Pedro Gómez", tipo: "Consulta Pediátrica", estado: "Completada" },
  ]);

  const [filtros, setFiltros] = useState({ fechaInicio: "", fechaFin: "", profesional: "", tipo: "" });
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleFilterApply = () => {
    const { fechaInicio, fechaFin, profesional, tipo } = filtros;
    const resultados = consultas.filter((consulta) => {
      const cumpleFecha =
        (!fechaInicio || new Date(consulta.fecha) >= new Date(fechaInicio)) &&
        (!fechaFin || new Date(consulta.fecha) <= new Date(fechaFin));
      const cumpleProfesional =
        !profesional || consulta.profesional.toLowerCase().includes(profesional.toLowerCase());
      const cumpleTipo = !tipo || consulta.tipo.toLowerCase().includes(tipo.toLowerCase());

      return cumpleFecha && cumpleProfesional && cumpleTipo;
    });
    setConsultas(resultados);
  };

  const handleConsultaClick = (consulta) => {
    setConsultaSeleccionada(consulta);
  };

  return (
    <div className="historial-container">
      <h1>Historial de Consultas</h1>
      {!consultaSeleccionada ? (
        <>
          <div className="filters">
            <h3>Filtrar Consultas</h3>
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFilterChange}
              placeholder="Fecha Inicio"
            />
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFilterChange}
              placeholder="Fecha Fin"
            />
            <input
              type="text"
              name="profesional"
              value={filtros.profesional}
              onChange={handleFilterChange}
              placeholder="Nombre del Profesional"
            />
            <input
              type="text"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFilterChange}
              placeholder="Tipo de Consulta"
            />
            <button onClick={handleFilterApply}>Aplicar Filtros</button>
          </div>

          <div className="consulta-list">
            <h3>Lista de Consultas</h3>
            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                className="consulta-item"
                onClick={() => handleConsultaClick(consulta)}
              >
                <p>Fecha: {consulta.fecha}</p>
                <p>Profesional: {consulta.profesional}</p>
                <p>Tipo: {consulta.tipo}</p>
                <p>Estado: {consulta.estado}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/Usuario-Dashboard")}>Regresar al Dashboard</button>
        </>
      ) : (
        <div className="consulta-detalles">
          <h2>Detalles de la Consulta</h2>
          <p>Fecha: {consultaSeleccionada.fecha}</p>
          <p>Profesional: {consultaSeleccionada.profesional}</p>
          <p>Tipo: {consultaSeleccionada.tipo}</p>
          <p>Estado: {consultaSeleccionada.estado}</p>
          <button onClick={() => setConsultaSeleccionada(null)}>Volver al Historial</button>
        </div>
      )}
    </div>
  );
}

export default HistorialConsultas;
