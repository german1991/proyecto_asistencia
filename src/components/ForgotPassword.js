import React, { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Realizar la solicitud fetch para enviar el correo de recuperación
    fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Enviar el correo en el cuerpo de la solicitud
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Mostrar el mensaje de respuesta
        setEmail(""); // Limpiar el campo de correo
      })
      .catch((error) => {
        setMessage("Error al enviar el correo de recuperación.");
        console.error("Error:", error);
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Enviar enlace de recuperación
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
