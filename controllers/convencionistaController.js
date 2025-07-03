const Convencionista = require('../models/Convencionista');

const create = async (req, res) => {
    const { 
        nombre, 
        apellido, 
        edad, 
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto,
        tipo_asamblea = 'no_asambleista'  // Valor por defecto
    } = req.body;
    
    const usuario_id = req.query.usuario_id;
    const zona_id = req.query.zona_id;

    console.log('Registro recibido:', { 
        nombre, 
        apellido, 
        zona_id,
        tipo_asamblea 
    });

    try {
        // Validación básica
        if (!nombre || !apellido || !referencia_pago || !zona_id || !usuario_id) {
            return res.status(400).json({ 
                error: 'Datos incompletos',
                requeridos: {
                    nombre: 'string',
                    apellido: 'string',
                    referencia_pago: 'string',
                    zona_id: 'number',
                    usuario_id: 'number'
                }
            });
        }

        const id = await Convencionista.create({
            nombre, 
            apellido, 
            edad: edad || null, 
            tipo_matricula, 
            tipo_pago, 
            referencia_pago, 
            monto, 
            zona_id,
            usuario_id,
            tipo_asamblea
        });
        
        res.status(201).json({ 
            success: true,
            id,
            message: 'Convencionista registrado exitosamente',
            data: {
                nombre,
                apellido,
                tipo_asamblea,
                referencia_pago,
                zona_id,
                usuario_id
            }
        });
    } catch (error) {
        console.error('Error en create:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al registrar convencionista',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getByZona = async (req, res) => {
    const zona_id = req.query.zona_id;
    
    if (!zona_id) {
        return res.status(400).json({
            success: false,
            error: 'zona_id es requerido'
        });
    }

    try {
        const convencionistas = await Convencionista.getByZona(zona_id);
        
        res.json({
            success: true,
            count: convencionistas.length,
            data: convencionistas
        });
    } catch (error) {
        console.error('Error en getByZona:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener convencionistas',
            details: error.message
        });
    }
};

const getStats = async (req, res) => {
    const zona_id = req.query.zona_id;
    
    if (!zona_id) {
        return res.status(400).json({
            success: false,
            error: 'zona_id es requerido'
        });
    }

    try {
        const stats = await Convencionista.getStatsByZona(zona_id);
        
        // Formateamos estadísticas de asambleistas
        const asambleistasStats = stats.porTipoAsamblea.reduce((acc, curr) => {
            acc[curr.tipo_asamblea] = curr.cantidad;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                total: stats.total,
                porTipoMatricula: stats.porTipoMatricula,
                porTipoPago: stats.porTipoPago,
                montoTotal: stats.montoTotal,
                asambleistas: asambleistasStats
            }
        });
    } catch (error) {
        console.error('Error en getStats:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener estadísticas',
            details: error.message
        });
    }
};

// Nuevo método para actualizar tipo_asamblea
const updateTipoAsamblea = async (req, res) => {
    const { id } = req.params;
    const { tipo_asamblea } = req.body;

    if (!id || !tipo_asamblea) {
        return res.status(400).json({
            success: false,
            error: 'ID y tipo_asamblea son requeridos'
        });
    }

    try {
        const updated = await Convencionista.updateTipoAsamblea(id, tipo_asamblea);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Convencionista no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Tipo de asamblea actualizado',
            data: { id, tipo_asamblea }
        });
    } catch (error) {
        console.error('Error en updateTipoAsamblea:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar',
            details: error.message
        });
    }
};

module.exports = { 
    create, 
    getByZona, 
    getStats, 
    updateTipoAsamblea 
};