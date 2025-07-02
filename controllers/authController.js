const md5 = require('md5'); // Reemplaza bcrypt por md5
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Zona = require('../models/Zona');
require('dotenv').config();

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Datos recibidos:', { username, password });
    
    try {
        const user = await User.findByUsername(username);
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

        console.log('Hash almacenado:', user.password);
        console.log('Contraseña recibida:', password);
        
        // Comparación con MD5 (directa ya que es un hash determinístico)
        const inputHash = md5(password);
        const match = inputHash === user.password;
        console.log('Resultado comparación:', match);
        
        if (!match) {
            // Genera un hash nuevo para debug
            const newHash = md5(password);
            console.log('Hash generado ahora:', newHash);
            return res.status(401).json({ 
                error: 'Contraseña incorrecta',
                debug: { 
                    stored_hash: user.password, 
                    input_hash: inputHash,
                    new_hash: newHash 
                }
            });
        }
        
        const zona = await Zona.getById(user.zona_id);
        
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, zona_id: user.zona_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                idzona: user.zona_id,
                nombre_completo: user.nombre_completo,
                zona: zona
            }
        });

    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = { login };