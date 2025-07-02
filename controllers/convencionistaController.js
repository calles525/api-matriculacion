const Convencionista = require('../models/Convencionista');

const create = async (req, res) => {
    // Extraemos los datos del body
    const { nombre, apellido, edad, tipo_matricula, tipo_pago, referencia_pago, monto } = req.body;
    
    // Obtenemos los IDs del usuario autenticado (del token)
    const usuario_id = req.query.usuario_id;
    const zona_id =req.query.zona_id;

    console.log('Datos recibidos:', zona_id)
           try {
        // Validación adicional de datos
        if (!nombre || !apellido || !referencia_pago) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const id = await Convencionista.create({
            nombre, 
            apellido, 
            edad, 
            tipo_matricula, 
            tipo_pago, 
            referencia_pago, 
            monto, 
            zona_id,  // Usamos el zona_id del usuario autenticado
            usuario_id // Usamos el usuario_id del usuario autenticado
        });
        
        res.status(201).json({ 
            id,
            message: 'Convencionista registrado exitosamente',
            data: {
              nombre,
              apellido,
              referencia_pago,
              zona_id,
              usuario_id
            }
        });
    } catch (error) {
        console.error('Error en create:', error);
        res.status(500).json({ 
            error: 'Error al registrar convencionista',
            details: error.message 
        });
    }
};

const getByZona = async (req, res) => {
    const zona_id = req.query.zona_id;
    
    try {
        const convencionistas = await Convencionista.getByZona(zona_id);
        res.json({
            count: convencionistas.length,
            data: convencionistas
        });
    } catch (error) {
        console.error('Error en getByZona:', error);
        res.status(500).json({ 
            error: 'Error al obtener convencionistas',
            details: error.message
        });
    }
};

const getStats = async (req, res) => {
    const zona_id = req.user.zona_id;
    
    try {
        const stats = await Convencionista.getStatsByZona(zona_id);
        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        console.error('Error en getStats:', error);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas',
            details: error.message
        });
    }
};

module.exports = { create, getByZona, getStats };