import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "533392797291-t5u6nnef81sbmpd2ibsr4vpg7313ic73.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large" }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    if (!email || !password) {
      setError("Por favor, rellene todos los campos.");
      setLoading(false); 
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      setLoading(false); 
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión.");
        setLoading(false); 
        return;
      }

      const data = await response.json();
      console.log("Respuesta completa de la API:", data);

      
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        console.log("Token guardado:", data.token);
      } else {
        console.error("No se recibió un token en la respuesta.");
        setError("Error al procesar la autenticación.");
        setLoading(false); 
        return;
      }

    
      if (data.rol) {
        if (data.rol === "prestador") {
            setTimeout(() => {
                navigate("/prestador-dashboard");
                window.location.reload(); 
            }, 10);
        } else {
            setTimeout(() => {
                navigate("/usuario-dashboard");
                window.location.reload(); 
            }, 10);
        }
    } else {
        console.error("No se recibió un campo 'rol'.");
        setLoading(false); 
    }
    

      setEmail("");
      setPassword("");
      setError("");

    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError("No se pudo conectar al servidor. Intente más tarde.");
      setLoading(false); 
    }
  };

  const handleGoogleResponse = (response) => {
    try {
      console.log("Credenciales de Google:", response.credential);

      const token = response.credential;
      const userInfo = parseJwt(token);
      console.log("Información del usuario:", userInfo);

     
      localStorage.setItem("jwt", token);

      
      if (userInfo.rol === "prestador") {
        navigate("/prestador-dashboard");
      } else {
        setTimeout(() => {
          navigate("/usuario-dashboard");
          window.location.reload(); 
      }, 10);
    }
    } catch (error) {
      console.error("Error en el inicio de sesión con Google:", error);
      setError("No se pudo iniciar sesión con Google. Intente de nuevo.");
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error("Error al decodificar el token:", e);
      return null;
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
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

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div id="google-signin-button" style={{ marginTop: "20px" }}></div>

      <div className="link-container">
        <div className="register-link">
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        </div>
        <div className="forgot-password-link">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;