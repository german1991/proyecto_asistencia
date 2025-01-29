import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import PersonalRecommendations from "./components/PersonalRecommendations";
import SpecialistList from "./components/SpecialistList";
import Register from "./components/Register";
import Login from "./components/login";
import ForgotPassword from "./components/ForgotPassword";
import PrestadorDashboard from "./components/PrestadorDashboard";
import UsuarioDashboard from "./components/UsuarioDashboard";
import ResetPasswordPage from "./components/ResetPasswordPage";
import HistorialConsultas from "./components/HistorialConsultas";
import Buscador from "./components/BuscarPrestador";
import PerfilProfesional from './components/PerfilProfesional';
import PagarSuscripcion from "./components/PagarSuscripcion";
import Success from "./components/Success";
import Proximamente from "./components/Proximamente";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PersonalRecommendations />
                <SpecialistList />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/specialistList" element={<SpecialistList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
          <Route path="/usuario-dashboard" element={<UsuarioDashboard />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/perfil-profesional" element={<PerfilProfesional />} />
          <Route path="/buscador" element={<Buscador />} />
          <Route path="/pagar-suscripcion" element={<PagarSuscripcion />} />
          <Route path="/success" element={<Success />} />
          <Route path="/proximamente" element={<Proximamente />} />
          <Route path="/historial-consultas" element={<HistorialConsultas />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
