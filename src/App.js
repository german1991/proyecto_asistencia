// src/App.js
import React from "react";
import Header from "./components/Header/Header";
import PersonalRecommendations from "./components/PersonalRecommendations";
import SpecialistList from "./components/SpecialistList";
import Register from "./components/Register";
import Login from "./components/login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard"; 
import PrestadorForm from "./components/PrestadorForm"; 
import { Routes, Route } from "react-router-dom";
import "./App.css";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prestador" element={<PrestadorForm />} />
          </Routes>
        </div>
      </div>
    
  );
}

export default App;
