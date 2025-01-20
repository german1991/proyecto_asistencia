import React, { useEffect, useState } from 'react';
import './perfilProfesional.css';

const PerfilProfesional = () => {
  const [perfilProfesional, setPerfilProfesional] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchPerfilProfesional = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/perfilProfesional', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPerfilProfesional(data.perfilProfesional);
          const storedEspecialidades = JSON.parse(localStorage.getItem('especialidades')) || data.perfilProfesional.especialidades || [];
          setEspecialidades(storedEspecialidades);
        } else {
          console.error('Error al obtener el perfil profesional');
        }
      } catch (error) {
        console.error('Error al obtener el perfil profesional:', error);
      }
    };

    fetchPerfilProfesional();
  }, [token]);

  const handleEspecialidadChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      const updatedEspecialidades = [...especialidades, value];
      setEspecialidades(updatedEspecialidades);
      localStorage.setItem('especialidades', JSON.stringify(updatedEspecialidades));
    } else {
      const updatedEspecialidades = especialidades.filter(especialidad => especialidad !== value);
      setEspecialidades(updatedEspecialidades);
      localStorage.setItem('especialidades', JSON.stringify(updatedEspecialidades));
    }
  };

  const opcionesEspecialidades = [
    'Médicos/as',
    'Odontólogos/as',
    'Kinesiólogos/as',
    'Fonoaudiólogos/as',
    'Acompañantes Terapéuticos',
    'Enfermeros/as',
    'Cuidadores/as'
  ];

  const saveEspecialidades = async () => {
    if (!token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile/actualizarEspecialidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ especialidades })
      });

      if (response.ok) {
        const data = await response.json();
        setPerfilProfesional(prev => ({
          ...prev,
          especialidades: data.map(especialidad => especialidad.especialidad)
        }));
        alert('Especialidades guardadas exitosamente!');
      } else {
        const errorData = await response.json();
        console.error('Error al asociar especialidades al usuario:', errorData);
      }
    } catch (error) {
      console.error('Error al asociar especialidades al usuario:', error);
    }
  };

  useEffect(() => {
    const syncEspecialidades = async () => {
      if (perfilProfesional && perfilProfesional.especialidades) {
        const storedEspecialidades = JSON.parse(localStorage.getItem('especialidades')) || perfilProfesional.especialidades;
        setEspecialidades(storedEspecialidades);
      }
    };
    syncEspecialidades();
  }, [perfilProfesional]);

  if (!perfilProfesional) {
    return <p>Cargando perfil profesional...</p>;
  }

  return (
    <div className="perfil-profesional">
      <h1 className="perfil-title">Perfil Profesional</h1>
      <div className="perfil-details">
        <p><strong>Email:</strong> {perfilProfesional.email}</p>
        <p><strong>Nombre:</strong> {perfilProfesional.nombre}</p>
        <p><strong>Apellido:</strong> {perfilProfesional.apellido}</p>
        <p><strong>Tipo de Documento:</strong> {perfilProfesional.tipo_documento}</p>
        <p><strong>Número de Documento:</strong> {perfilProfesional.numero_documento}</p>
        <p><strong>CUIT:</strong> {perfilProfesional.cuit}</p>
        <p><strong>Matrícula:</strong> {perfilProfesional.matricula}</p>
        <p><strong>Provincia:</strong> {perfilProfesional.provincia}</p>
        <p><strong>Jurisdicción:</strong> {perfilProfesional.jurisdiccion}</p>
        <p><strong>Institución Formadora:</strong> {perfilProfesional.institucion_formadora}</p>
      </div>

      <div className="perfil-especialidades">
        <h2>Selecciona tus especialidades</h2>
        <form>
          {opcionesEspecialidades.map((opcion, index) => (
            <div key={index} className="especialidad-item">
              <label>
                <input
                  type="checkbox"
                  value={opcion}
                  checked={especialidades.includes(opcion)}
                  onChange={handleEspecialidadChange}
                />
                {opcion}
              </label>
            </div>
          ))}
        </form>
        <button
          onClick={saveEspecialidades}
          className="btn-guardar"
        >
          Guardar Especialidades
        </button>

        <div className="perfil-especialidades-seleccionadas">
          <h3>Especialidades Seleccionadas:</h3>
          {especialidades.map((especialidad, index) => (
            <p key={index}>{especialidad}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerfilProfesional;
