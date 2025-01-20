import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Importar la librería para manejar cookies
import '../components/ForgotPassword';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Guardar el token de la URL en una cookie
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        if (token) {
            // Verificar si el token está presente y guardarlo en la cookie
            Cookies.set('reset_token', token, { expires: 1, secure: window.location.protocol === 'https:', path: '/' });
            console.log("Token guardado en la cookie:", Cookies.get('reset_token'));  // Verifica si la cookie está siendo guardada
        }
    }, []);
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        const token = Cookies.get('reset_token');  // Recupera el token de la cookie
        console.log("Token desde la cookie:", token); 

        // Verificar si el token es válido
        if (!token) {
            setErrorMessage('El token de restablecimiento no es válido.');
            return;
        }

        try {
            console.log("Token en la cookie:", Cookies.get('reset_token')); // Verifica el token en la cookie
            console.log("Token enviado en la solicitud:", token); // Verifica el token enviado en la solicitud

            // Realizar la solicitud para restablecer la contraseña
            const response = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('¡Contraseña restablecida exitosamente!');
                setErrorMessage('');
            } else {
                setErrorMessage(data.message || 'Error al restablecer la contraseña.');
            }
        } catch (error) {
            setErrorMessage('Hubo un problema al procesar tu solicitud.');
        }
    };

    return (
        <div className="reset-password-container">
            <h1>Restablecer Contraseña</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit" className="btn">Restablecer Contraseña</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
