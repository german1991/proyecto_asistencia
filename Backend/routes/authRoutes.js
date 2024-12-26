const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Importa la conexión a la base de datos
const axios = require('axios'); // Importamos axios para hacer solicitudes externas

// Ruta para registro (simplificada)
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  // Aquí iría la lógica para almacenar al usuario en la base de datos
  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Ruta para login (simplificada)
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  // Aquí iría la lógica para autenticar al usuario
  res.status(200).json({ message: "Inicio de sesión exitoso" });
});

// Nueva ruta para la validación del profesional
router.get("/profesional/validar", async (req, res) => {
  const { apellido, nombre, nrodoc } = req.query; // Usamos req.query para obtener los parámetros GET

  // Verificar si faltan los parámetros
  if (!apellido || !nombre || !nrodoc) {
    return res.status(400).json({ message: "Faltan datos importantes (apellido, nombre, nrodoc)" });
  }

  // Construir la URL para la API externa
  const url = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?usuario=faprado&clave=SEXP1POM70&apellido=${encodeURIComponent(apellido)}&nombre=${encodeURIComponent(nombre)}&nrodoc=${encodeURIComponent(nrodoc)}`;

  try {
    const response = await axios.get(url); // Hacemos la solicitud externa
    res.status(200).json(response.data); // Enviamos la respuesta de la API externa al frontend
  } catch (error) {
    console.error('Error al obtener datos del profesional:', error);
    res.status(500).json({ message: 'Error al obtener datos del profesional' });
  }
});

module.exports = router;
