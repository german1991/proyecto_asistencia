const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db'); 
const cors = require('cors');
const axios = require('axios'); 
const mailjet = require('node-mailjet');
const crypto = require('crypto'); 
const jwt = require('jsonwebtoken'); 
const app = express();
const router = express.Router();
const fetch = require('node-fetch');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));



const session = require('express-session'); 

const JWT_SECRET = 'tu-clave-secreta-para-tokens';

app.use((req, res, next) => {
    console.log(`Middleware: ${req.method} ${req.url}`);
    next();
});

app.use(session({
    secret: 'mi-clave-secreta-ultra-segura-12345',
    resave: false,
    saveUninitialized: false
}));



// Configuración de credenciales de PayPal
const PAYPAL_CLIENT_ID = "AZt4wl7D9iJWw_FhA_b2iZSbpJyE2ik-BpX-qvoJFAz7bZ8ro8XF2_k05n9pIBpFsDyMOkYZGpw7mJyh";
const PAYPAL_CLIENT_SECRET = "EG0IZA1F9BeAJuxugY1j-ZRgVaZHA_MgvykccaJ-wT49YU1U05njkiVtJD-dq850dvVy4wNuoD9HsfFo";
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

// Función para obtener el token de acceso
const getAccessToken = async () => {
  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Error al obtener el token de acceso.");
  }

  const data = await response.json();
  return data.access_token;
};





app.post("/api/create-subscription", async (req, res) => {
    try {
      const access_token = await getAccessToken(); 
  
      if (!access_token) {
        throw new Error("Token de acceso no válido.");
      }
  
      console.log("Access Token:", access_token); 
  
      
      const subscriptions = [
        {
          plan_id: "P-63J5341477236480YM6GXN4Y",
          application_context: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
          },
        },
        {
          plan_id: "P-1SN888843P480694JM6GZUSI",
          application_context: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
          },
        },
      ];
  
      const subscriptionResponses = await Promise.all(
        subscriptions.map(subscription =>
          fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
          })
        )
      );
  
      const subscriptionData = await Promise.all(
        subscriptionResponses.map(response => response.json())
      );
  
      console.log("Response Data:", subscriptionData); 
  
      const approveLinks = subscriptionData.map(data =>
        data.links.find(link => link.rel === "approve")
      );
  
      if (approveLinks.every(link => link)) {
        const approveUrls = approveLinks.map(link => link.href);
        console.log("Approve Links:", approveUrls); 
        res.json({ approveUrls }); 
      } else {
        res.status(400).json({ message: "No se encontraron enlaces de aprobación." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

app.get("/api/subscription-status", (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token inválido" });
      }
  
      const userId = decoded.id;
  
      db.query("SELECT subscription_id FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error interno del servidor." });
        }
  
        if (result.length > 0 && result[0].subscription_id) {
          res.json({ suscripcion_activa: true });
        } else {
          res.json({ suscripcion_activa: false });
        }
      });
    });
  });
  












app.post("/api/confirm-subscription", (req, res) => {
    const { subscription_id } = req.body; 
    const token = req.headers['authorization']?.split(' ')[1]; 

    console.log("Endpoint alcanzado: /api/confirm-subscription");
    console.log("subscription_id recibido:", subscription_id);
    console.log("Token recibido:", token);

    if (!subscription_id || !token) {
        console.error("Faltan parámetros o el token no está presente.");
        return res.status(400).json({ message: "Faltan parámetros o el token no está presente." });
    }


    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error al verificar el token:", err);
            return res.status(401).json({ message: "Token inválido." });
        }

        console.log("Contenido del token decodificado:", decoded); 

       
        const userId = decoded.id;
        console.log("userId (desde JWT):", userId);

        if (!userId) {
            console.error("No se pudo obtener el userId del token.");
            return res.status(400).json({ message: "No se pudo obtener el userId del token." });
        }

       
        db.query(
            "UPDATE users SET subscription_id = ? WHERE id = ?", 
            [subscription_id, userId], 
            (err, result) => {
                if (err) {
                    console.error("Error actualizando la base de datos:", err);
                    return res.status(500).json({ message: "Error interno del servidor." });
                }

                console.log("Resultado de la actualización:", result.affectedRows);

                if (result.affectedRows === 0) {
                    console.warn("No se encontró un usuario con el ID proporcionado.");
                    return res.status(404).json({ message: "Usuario no encontrado." });
                }

                console.log("subscription_id actualizado correctamente en la base de datos.");
                
            }
        );
    });
});



  

  

app.post('/api/logout', (req, res) => {
    console.log('Middleware: POST /api/logout');
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.status(200).send('Sesión cerrada correctamente');
    });
});





app.get('/api/prestadores', (req, res) => {
    const especialidad = req.query.especialidad;

    if (!especialidad) {
        return res.status(400).send('El parámetro "especialidad" es obligatorio');
    }

    db.query(`
        SELECT 
            u.id,
            u.email,
            u.nombre,
            u.apellido
        FROM 
            users u
        JOIN 
            usuario_especialidades ue ON u.id = ue.usuario_id
        JOIN 
            especialidades e ON ue.especialidad_id = e.id
        WHERE 
            e.especialidad LIKE ?`,
        [`%${especialidad}%`],
        (err, results) => {
            if (err) {
                console.error('Error al obtener los datos:', err);
                return res.status(500).send('Error en la solicitud: ' + err.message);
            }
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('No se encontraron resultados');
            }
        }
    );
});







const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'tu-clave-secreta-para-tokens', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user; 
    next();
  });
};


app.get('/api/perfilprofesional', authenticateToken, (req, res) => {
    res.json({ mensaje: 'Perfil profesional', usuario: req.usuario });
  });



const client = mailjet.apiConnect('c3392ed4598b22b42b5e6611eb92e748', '1fe97b004606bbb51f00b53b2d27f442');


app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ message: 'Error al buscar usuario' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result[0];

        
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpires = new Date(Date.now() + 3600000); 

        db.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', 
            [token, tokenExpires, email], (err) => {
            if (err) {
                console.error('Error al guardar el token:', err);
                return res.status(500).json({ message: 'Error al guardar el token' });
            }

            
            const resetLink = `http://localhost:3000/reset-password?token=${token}`;

            
            const mailOptions = {
                Messages: [
                    {
                        From: {
                            Email: "g.zarate42@gmail.com",
                            Name: "No Reply"
                        },
                        Sender: {
                            Email: "g.zarate42@gmail.com",
                            Name: "No Reply"
                        },
                        To: [
                            {
                                Email: email 
                            }
                        ],
                        Subject: "Recuperación de Contraseña",
                        TextPart: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
                        HtmlPart: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                                   <p><a href="${resetLink}">${resetLink}</a></p>`
                    }
                ]
            };
            
            client.post('send', { version: 'v3.1' }).request(mailOptions)
                .then(() => {
                    res.status(200).json({ message: 'Correo de recuperación enviado con éxito' });
                })
                .catch((error) => {
                    console.error('Error al enviar el correo:', error.response?.body || error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                });
        });
    });
});



const eventos = [];


app.post("/webhook-calendly", (req, res) => {
  console.log("Webhook recibido:", req.body);
  const eventData = req.body.payload; 

  if (!eventData || !eventData.event) {
    return res.status(400).json({ message: "Evento inválido" });
  }


  const event = {
    title: `Turno con ${eventData.invitee.name}`,
    start: eventData.event.start_time,
    end: eventData.event.end_time,
  };

 
  eventos.push(event);

  console.log("Evento guardado:", event);
  res.status(200).send("Evento recibido");
});


app.get("/api/turnos", (req, res) => {
  res.json(eventos);
});


const token = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzM3MDUzMzAxLCJqdGkiOiI4OWU1MzJkZi1iYTJmLTRiYWMtODkxNS01MWY5Y2I5YjE1Y2QiLCJ1c2VyX3V1aWQiOiJiN2U4OGI2Yi0yMzZkLTQ1MDQtYjBhYi1iYzc5YzNiZGJhNTAifQ.fRNw7YJfVoHaBCBa7A1SlFxM19e0ctt9_BoJ_GRFLRiY61EN6eSzARS6djHgRWc3irg7z92-3BIHJXaHl6johA";

async function createWebhook() {
  try {
    const response = await fetch("https://api.calendly.com/webhook_subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "http://localhost:5000/webhook-calendly", 
        events: ["invitee.created"], 
      }),
    });

    const data = await response.json();
    console.log("Webhook creado:", data);
  } catch (error) {
    console.error("Error al crear el webhook:", error);
  }
}

createWebhook();



app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

   
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    
    db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', 
        [token, new Date()], (err, result) => {
        if (err) {
            console.error('Error al buscar token:', err);
            return res.status(500).json({ message: 'Error al buscar token' });
        }
        if (result.length === 0) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        const user = result[0];

        
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return res.status(500).json({ message: 'Error al restablecer la contraseña' });
            }

            
            db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', 
                [hashedPassword, user.id], (err) => {
                if (err) {
                    console.error('Error al actualizar la contraseña:', err);
                    return res.status(500).json({ message: 'Error al actualizar la contraseña' });
                }
                res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
            });
        });
    });
});



app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length > 0) {
            const validPassword = await bcrypt.compare(password, user[0].password);

            if (validPassword) {
                
                const token = jwt.sign(
                    { id: user[0].id, email: user[0].email, rol: user[0].rol },
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                );
                console.log("Token JWT generado:", token);

                
                const rol = user[0].rol || 'default';

                if (rol === 'prestador') {
                    const [perfil] = await db.promise().query('SELECT * FROM perfiles_profesionales WHERE email = ?', [email]);

                    if (perfil.length > 0) {
                        return res.status(200).json({
                            message: 'Login exitoso y datos de perfil profesional mostrados',
                            token, 
                            user: user[0],
                            perfilProfesional: perfil[0],
                            rol: rol
                        });
                    } else {
                        return res.status(404).json({ message: 'Perfil profesional no encontrado' });
                    }
                }

                
                return res.status(200).json({
                    message: 'Login exitoso',
                    token, 
                    user: user[0],
                    rol: rol
                });
            } else {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (dbError) {
        console.error('Error en la base de datos:', dbError.message);
        return res.status(500).json({ message: 'Error en la base de datos' });
    }
});







app.get('/api/profile/perfilProfesional', authenticateToken, async (req, res) => {
    try {
        const { email, rol } = req.user; 

        if (rol === 'prestador') {
            const [perfil] = await db.promise().query(
                'SELECT * FROM perfiles_profesionales WHERE email = ?',
                [email]
            );

            if (perfil.length > 0) {
                return res.status(200).json({
                    message: 'Datos del perfil profesional obtenidos exitosamente',
                    perfilProfesional: perfil[0], 
                    rol: rol,
                });
            } else {
                return res.status(404).json({ message: 'Perfil profesional no encontrado' });
            }
        } else {
            return res.status(403).json({ message: 'Acceso no autorizado para este rol' });
        }
    } catch (error) {
        console.error('Error al obtener el perfil profesional:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});





app.post('/api/register', async (req, res) => {
    const { email, password, nombre, apellido, documento, selectedRole } = req.body;

    let detectedRole = 'usuario'; 
    let apiResponse;

    try {
        
        const url = `http://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?usuario=faprado&clave=SEXP1POM70&apellido=${encodeURIComponent(apellido)}&nombre=${encodeURIComponent(nombre)}&nrodoc=${encodeURIComponent(documento)}`;
        apiResponse = await axios.get(url);
        console.log("Respuesta de la API de SISA:", apiResponse.data);

        if (apiResponse.status === 200 && apiResponse.data.resultado === 'OK') {
            detectedRole = 'prestador';
        }
    } catch (error) {
        console.error('Error al conectar con la API de SISA:', error.message);
        return res.status(500).json({ message: 'Error al verificar el rol en la API externa' });
    }

    
    if (detectedRole === 'prestador' && !selectedRole) {
        return res.status(200).json({
            message: 'Se te identificó como prestador. ¿Con qué rol deseas registrarte?',
            rolesAvailable: ['prestador', 'usuario'],
            needsRoleSelection: true,
        });
    }

    try {
       
        const [emailCheck] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (emailCheck.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

       
        const [docCheck] = await db.promise().query('SELECT * FROM users WHERE documento = ?', [documento]);
        if (docCheck.length > 0) {
            return res.status(400).json({ message: 'El documento ya está registrado' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const roleToSave = selectedRole || detectedRole;

        
        await db.promise().query(
            'INSERT INTO users (email, password, nombre, apellido, documento, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, nombre, apellido, documento, roleToSave]
        );

        
        if (detectedRole === 'prestador' && apiResponse?.data) {
            const matriculaData = apiResponse.data.matriculas?.[0] || {};
            const matricula = matriculaData.matricula || null;
            const provincia = matriculaData.provincia || 'Sin provincia';
            const jurisdiccion = matriculaData.jurisdiccion || 'Sin jurisdicción';
            const institucionFormadora = matriculaData.institucionFormadora || 'Sin institución formadora';

            const { nombre: nombreSISA, apellido: apellidoSISA, tipoDocumento, numeroDocumento, cuit } = apiResponse.data;

            console.log('Datos para insertar en perfiles_profesionales:', {
                nombreSISA,
                apellidoSISA,
                tipoDocumento,
                numeroDocumento,
                cuit,
                matricula,
                provincia,
                jurisdiccion,
                institucionFormadora,
            });

            await db.promise().query(
                'INSERT INTO perfiles_profesionales (nombre, apellido, tipo_documento, numero_documento, cuit, matricula, provincia, jurisdiccion, institucion_formadora, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    nombreSISA,
                    apellidoSISA,
                    tipoDocumento,
                    numeroDocumento,
                    cuit,
                    matricula,
                    provincia,
                    jurisdiccion,
                    institucionFormadora,
                    email,
                ]
            );
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente', rol: roleToSave });
    } catch (error) {
        console.error('Error en la base de datos:', error.message);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});




app.post('/api/profile/actualizarEspecialidades', authenticateToken, async (req, res) => {
    const { especialidades } = req.body;
    const { id } = req.user; 

    if (!especialidades || especialidades.length === 0) {
        return res.status(400).json({ error: 'Especialidades son requeridas' });
    }

    try {
        
        const insertPromises = especialidades.map(async nombre => {
            const [especialidad] = await db.promise().query('SELECT id FROM especialidades WHERE especialidad = ?', [nombre]);
            if (especialidad.length === 0) {
                const [newEspecialidad] = await db.promise().query('INSERT INTO especialidades (especialidad) VALUES (?)', [nombre]);
                return newEspecialidad.insertId;
            }
            return especialidad[0].id;
        });

        const especialidadIds = await Promise.all(insertPromises);

        const linkPromises = especialidadIds.map(async especialidadId => {
            
            const [usuario] = await db.promise().query('SELECT id FROM users WHERE id = ?', [id]);
            if (usuario.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            return db.promise().query(
                'INSERT INTO usuario_especialidades (usuario_id, especialidad_id) VALUES (?, ?)',
                [id, especialidadId]
            );
        });

        await Promise.all(linkPromises);

        
        const [especialidadesAsociadas] = await db.promise().query(
            `SELECT e.especialidad AS especialidad
             FROM usuario_especialidades ue
             LEFT JOIN especialidades e ON ue.especialidad_id = e.id
             WHERE ue.usuario_id = ?`,
            [id]
        );

        res.status(201).json(especialidadesAsociadas);
    } catch (error) {
        console.error('Error al asociar especialidades:', error);
        res.status(500).json({ error: 'Error al asociar especialidades' });
    }


    

    

});




















// Configuración del servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
