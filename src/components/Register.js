import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, apellido, documento, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    try {
        let roleSelection = null;
        let registrationComplete = false;

        while (!registrationComplete) {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, apellido, documento, email, password, selectedRole: roleSelection }),
            });

            const data = await response.json();

            if (response.ok && data.needsRoleSelection) {
                
                const selectedRole = window.prompt(
                    `${data.message}\nEscribe "prestador" o "usuario" para continuar.`,
                    "prestador"
                );

                if (!selectedRole || !data.rolesAvailable.includes(selectedRole.toLowerCase())) {
                    alert("Debes seleccionar un rol válido.");
                } else {
                    roleSelection = selectedRole.toLowerCase();
                }
            } else if (!response.ok) {
                throw new Error(data.message || "Error desconocido");
            } else {
                registrationComplete = true;
                alert("Registro exitoso");
                navigate("/login");
            }
        }
    } catch (error) {
        console.error("Error en el registro:", error.message);
        setError(`Error en el registro: ${error.message}`);
    }
};


  
  return (
    <div className="register-container">
      <h2>Formulario de Registro</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="documento">Número de Documento</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>

      <div className="login-link">
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  );
}

export default Register;
