import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // Estado para manejar el mensaje de éxito o error

  useEffect(() => {
    // Recuperar los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get("subscription_id");
    const token = localStorage.getItem("jwt"); // Recupera el token guardado en el localStorage

    // Si no se obtienen los parámetros necesarios, mostrar un mensaje de error
    if (!subscriptionId || !token) {
      setSubscriptionStatus("Error al recuperar los datos de la suscripción.");
      return;
    }

    // Enviar el token al backend después de la redirección
    fetch(`http://localhost:5000/api/confirm-subscription`, {
      method: "POST", // Usar POST para mayor seguridad
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Suscripción confirmada") {
          setSubscriptionStatus("Suscripción exitosa"); // Mostrar mensaje de éxito
          localStorage.removeItem("jwt"); // Limpiar el token después de la confirmación
        } else {
          setSubscriptionStatus("Hubo un error al procesar la suscripción.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubscriptionStatus("Hubo un error al procesar la suscripción.");
      });
  }, [navigate]);

  const handleGoToDashboard = () => {
    navigate("/prestador-dashboard"); // Redirige al Dashboard
  };

  return (
    <div>
      <h2>{subscriptionStatus || "Suscripción exitosa"}</h2>
      
        <button onClick={handleGoToDashboard}>Ir al Dashboard</button>
      
    </div>
  );
};

export default SuccessPage;
