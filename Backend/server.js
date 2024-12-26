const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db'); 
const cors = require('cors');
const axios = require('axios'); 


const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result[0];

        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error en la comparación de contraseñas' });
            }
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    });
});


app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la verificación del correo' });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

       
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el hashing de la contraseña' });
            }

            
            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al registrar el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
});


app.get('/api/profesional/validar', async (req, res) => {
    const { apellido, nombre, nrodoc } = req.query;

    
    if (!apellido || !nombre || !nrodoc) {
        return res.status(400).json({ message: 'Faltan datos importantes (apellido, nombre, nrodoc)' });
    }

    
    const url = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?usuario=faprado&clave=SEXP1POM70&apellido=${encodeURIComponent(apellido)}&nombre=${encodeURIComponent(nombre)}&nrodoc=${encodeURIComponent(nrodoc)}`;
    console.log('URL para la API externa:', url);

    try {
       
        const response = await axios.get(url);
        console.log('Respuesta recibida de la API externa:', response.data); 

        if (response.status === 200) {
           
            const result = response.data;

            
            if (result.resultado === 'OK') {
                console.log('Datos del profesional obtenidos:', result);
                res.status(200).json({ message: 'Datos de profesional obtenidos correctamente', data: result });
            } else {
                res.status(404).json({ message: 'Profesional no encontrado' });
            }
        } else {
            
            console.error('Error al obtener datos del profesional:', response.status);
            res.status(400).json({ message: 'No se pudo obtener los datos del profesional', status: response.status });
        }
    } catch (error) {
        console.error('Error al conectar con el servicio:', error);
        res.status(500).json({ message: 'Error al conectar con el servicio', error: error.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
