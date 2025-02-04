import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); 

  useEffect(() => {
   
    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get("subscription_id");
    const token = localStorage.getItem("jwt"); 

    
    if (!subscriptionId || !token) {
      setSubscriptionStatus("Error al recuperar los datos de la suscripción.");
      return;
    }

    
    fetch(`http://localhost:5000/api/confirm-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Suscripción confirmada") {
          setSubscriptionStatus("Suscripción exitosa"); 
          localStorage.removeItem("jwt");
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
    navigate("/prestador-dashboard"); 
  };

  return (
    <div>
      <h2>{subscriptionStatus || "Suscripción exitosa"}</h2>
      
        <button onClick={handleGoToDashboard}>Ir al Dashboard</button>
      
    </div>
  );
};

export default SuccessPage;
