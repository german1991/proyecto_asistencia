import React, { useState } from 'react';

const Buscador = () => {
  const [especialidad, setEspecialidad] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEspecialidad(e.target.value);
  };

  const handleBuscar = async () => {
    // Validación del campo antes de buscar
    if (!especialidad.trim()) {
      alert('Por favor, ingrese una especialidad antes de buscar.');
      return;
    }

    setLoading(true);
    setError(null); // Reseteamos errores previos

    try {
      const response = await fetch(`http://localhost:5000/api/prestadores?especialidad=${especialidad}`);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${message}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        setResultados([]);
        setError('No se encontraron resultados para esta especialidad.');
      } else {
        setResultados(data);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error.message);
      setError('Ocurrió un error al realizar la solicitud. Por favor, inténtelo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Buscador de Prestadores</h1>
      <input
        type="text"
        placeholder="Ingrese especialidad"
        value={especialidad}
        onChange={handleChange}
        style={{
          padding: '10px',
          width: '300px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleBuscar}
        style={{
          padding: '10px 20px',
          marginLeft: '10px',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {resultados.length > 0 && (
          <div>
            <h2>Resultados:</h2>
            {resultados.map((resultado) => (
              <div
                key={resultado.id}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <p><strong>Nombre:</strong> {resultado.nombre}</p>
                <p><strong>Apellido:</strong> {resultado.apellido}</p>
                <p><strong>Email:</strong> {resultado.email}</p>
                <p><strong>Tipo de Documento:</strong> {resultado.tipo_documento || 'N/A'}</p>
                <p><strong>Número de Documento:</strong> {resultado.numero_documento || 'N/A'}</p>
                <button
                  onClick={() => {
                    window.open('https://calendly.com/azscs/30min', '_blank');
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Ver Calendario
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buscador;
