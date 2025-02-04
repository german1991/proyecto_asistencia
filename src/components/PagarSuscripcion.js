import React, { useState } from "react";
import "./PagarSuscripcion.css"; 

const PagarSuscripcion = () => {
  const [approvalUrls, setApprovalUrls] = useState([]);
  const prices = ["$10/mes", "$25/mes", "$50/mes"]; 

  const handleSubscribe = async () => {
    const token = localStorage.getItem('jwt'); 
    if (!token) {
      alert("Por favor, inicia sesión primero.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al crear la suscripción.");
      }
  
      const data = await response.json();
  
      if (data.approveUrls && data.approveUrls.length > 0) {
        localStorage.setItem("jwt", token); 
        setApprovalUrls(data.approveUrls);
      } else {
        throw new Error("No se pudieron obtener los enlaces de aprobación.");
      }
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
      alert("Hubo un error al iniciar la suscripción. Inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <button className="paypal-button" onClick={handleSubscribe}>
        Conoce nuestros planes
      </button>

      {approvalUrls.length > 0 ? (
        <div className="card-container">
          {approvalUrls.map((url, index) => (
            <div key={index} className="card">
              <div className="card-header">Plan de Suscripción {index + 1}</div>
              <div className="card-price">{prices[index] || "Precio no disponible"}</div>
              <div className="card-body">
                <p className="card-description">
                  Con este plan disfrutarás de:
                  <ul>
                    <li>Acceso ilimitado a contenido exclusivo.</li>
                    <li>Soporte técnico prioritario 24/7.</li>
                    <li>Actualizaciones automáticas incluidas.</li>
                    <li>Descuentos especiales en servicios adicionales.</li>
                  </ul>
                </p>
                <button
                  className="card-button"
                  onClick={() => window.open(url, "_blank")}
                >
                  Elegi este plan
                </button>
              </div>
              <div className="card-footer">
                 {index + 1}.
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PagarSuscripcion;
