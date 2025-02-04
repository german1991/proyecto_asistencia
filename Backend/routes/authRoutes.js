const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); 
const axios = require('axios'); 


router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  res.status(201).json({ message: "Usuario registrado exitosamente" });
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  res.status(200).json({ message: "Inicio de sesión exitoso" });
});

router.get("/profesional/validar", async (req, res) => {
  const { apellido, nombre, nrodoc } = req.query; 


  if (!apellido || !nombre || !nrodoc) {
    return res.status(400).json({ message: "Faltan datos importantes (apellido, nombre, nrodoc)" });
  }


  const url = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?usuario=faprado&clave=SEXP1POM70&apellido=${encodeURIComponent(apellido)}&nombre=${encodeURIComponent(nombre)}&nrodoc=${encodeURIComponent(nrodoc)}`;

  try {
    const response = await axios.get(url); 
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al obtener datos del profesional:', error);
    res.status(500).json({ message: 'Error al obtener datos del profesional' });
  }
});

module.exports = router;
