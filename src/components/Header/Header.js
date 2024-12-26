import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar si el menú está abierto
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado

  // Función que alterna el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Simulamos el login (esto debe ser reemplazado con la lógica real de autenticación)
  const handleLogin = () => {
    setIsLoggedIn(true); // Aquí simula que el usuario hace login
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simula que el usuario hace logout
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* Botón del menú hamburguesa */}
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>

        {/* Información del usuario */}
        <div className="user-info">
          {/* Enlace al Home con icono de casa */}
          <Link to="/" className="home-link">
            <i className="bi bi-house-door home-icon"></i> {/* Icono de la casa */}
          </Link>

          {/* Si el usuario no está logueado, mostramos el botón de registro */}
          {!isLoggedIn ? (
            <Link to="/register" className="register-button">
              <button className="btn btn-primary">Registrarse</button>
            </Link>
          ) : (
            // Si el usuario está logueado, mostramos el ícono de persona
            <button className="btn btn-secondary" onClick={handleLogout}>
              <i className="bi bi-person"></i> {/* Icono de persona */}
            </button>
          )}
        </div>
      </div>

      {/* Icono de salud centrado */}
      <div className="health-icon-container">
        <i className="bi bi-clipboard-heart"></i> {/* Icono de salud */}
      </div>

      {/* Menú desplegable, solo visible cuando isMenuOpen es true */}
      <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#home">Inicio</a></li>
          <li><a href="#features">Características</a></li>
          <li><a href="#pricing">Precios</a></li>
        </ul>
      </nav>

      {/* Contenido adicional */}
      <div className="header-content">
        <h1>Encuentra todos los cuidados que buscas</h1>
        <button className="primary-button">Ver Especialistas</button>
      </div>
    </header>
  );
}

export default Header;
