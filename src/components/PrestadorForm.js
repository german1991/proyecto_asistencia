import React, { useState } from "react";
import "./PrestadorForm.css";

function PrestadorForm() {
  const [profile, setProfile] = useState({
    apellido: "",
    nombre: "",
    nrodoc: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

 
  const validateForm = () => {
    const newErrors = {};
    if (!profile.apellido) newErrors.apellido = "El apellido es obligatorio";
    if (!profile.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!profile.nrodoc) newErrors.nrodoc = "El número de documento es obligatorio";
    return newErrors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      
      const response = await fetch(
        `http://localhost:5000/api/profesional/validar?apellido=${encodeURIComponent(profile.apellido)}&nombre=${encodeURIComponent(profile.nombre)}&nrodoc=${encodeURIComponent(profile.nrodoc)}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
       
        setSuccessMessage(data.message);
      } else {
        
        setSuccessMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setSuccessMessage("Error al conectar con el servicio.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Validar Prestador</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={profile.apellido}
            onChange={handleInputChange}
            placeholder="Tu apellido"
          />
          {errors.apellido && <p className="error">{errors.apellido}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={profile.nombre}
            onChange={handleInputChange}
            placeholder="Tu nombre"
          />
          {errors.nombre && <p className="error">{errors.nombre}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="nrodoc">Número de Documento</label>
          <input
            type="text"
            id="nrodoc"
            name="nrodoc"
            value={profile.nrodoc}
            onChange={handleInputChange}
            placeholder="Tu número de documento"
          />
          {errors.nrodoc && <p className="error">{errors.nrodoc}</p>}
        </div>

        <button type="submit">Validar y Registrar</button>
      </form>
    </div>
  );
}

export default PrestadorForm;
