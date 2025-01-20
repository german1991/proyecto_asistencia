import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar si el menú está abierto
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado
  const navigate = useNavigate(); // Hook para redirección

  // Función que alterna el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Actualiza el estado `isLoggedIn` al cargar el componente
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    setIsLoggedIn(!!jwt);
  }, []);

  // Listener para cambios en `localStorage`
  useEffect(() => {
    const handleStorageChange = () => {
      const jwt = localStorage.getItem("jwt");
      setIsLoggedIn(!!jwt);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
      });
      localStorage.removeItem("jwt"); // Eliminar JWT del localStorage
      setIsLoggedIn(false); // Actualizar estado de logueo
      navigate("/");
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleVerEspecialistas = () => {
    navigate("/buscador"); // Redirige al formulario de búsqueda
  };

  return (
    <header className="header">
      <div className="header-top">
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>

        <div className="user-info">
          <Link to="/" className="home-link">
            <i className="bi bi-house-door home-icon"></i>
          </Link>

          {!isLoggedIn ? (
            <Link to="/register" className="register-button">
              <button className="btn btn-primary">Registrarse</button>
            </Link>
          ) : (
            <button className="btn btn-secondary" onClick={handleLogout}>
              <i className="bi bi-person"></i>
            </button>
          )}
        </div>
      </div>

      <div className="health-icon-container">
        <i className="bi bi-clipboard-heart"></i>
      </div>

      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="#home">Inicio</a></li>
          <li><a href="#features">Características</a></li>
          <li><a href="#pricing">Precios</a></li>
        </ul>
      </nav>

      <div className="header-content">
        <h1>Encuentra todos los cuidados que buscas</h1>
        {!window.location.pathname.includes("/buscador") && (
          <button className="primary-button" onClick={handleVerEspecialistas}>
            Buscar Especialistas
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
