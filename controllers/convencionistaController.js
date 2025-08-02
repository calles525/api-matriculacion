const Convencionista = require('../models/Convencionista');

const create = async (req, res) => {
    const { 
        nombre, 
        apellido, 
        edad, 
        sexo,
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto,
        tipo_asamblea  // Nuevo valor por defecto
    } = req.body;
    
    const usuario_id = req.query.usuario_id;
    const zona_id = req.query.zona_id;

    console.log('Registro recibido:', { 
        nombre, 
        apellido, 
        zona_id,
        tipo_asamblea,
        sexo
    });

    try {
        // Validación básica
        if (!nombre || !apellido || !referencia_pago || !zona_id || !usuario_id) {
            return res.status(400).json({ 
                success: false,
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
            sexo,
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
                edad,
                sexo,
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

const create2 = async (req, res) => {
    const { 
        nombre, 
        apellido, 
        edad, 
        sexo,
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto,
        tipo_asamblea,  // Nuevo valor por defecto
        comite,
        zona_id
    } = req.body;
    
    const usuario_id = req.query.usuario_id;

    console.log('Registro recibido:', { 
         nombre, 
        apellido, 
        edad, 
        sexo,
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto,
        tipo_asamblea,  // Nuevo valor por defecto
        comite,
        zona_id
    });

    try {
        // Validación básica
        if (!nombre || !apellido || !referencia_pago || !zona_id || !usuario_id) {
            return res.status(400).json({ 
                success: false,
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

        const id = await Convencionista.create2({
            nombre, 
            apellido, 
            edad: edad || null, 
            sexo,
            tipo_matricula, 
            tipo_pago, 
            referencia_pago, 
            monto, 
            zona_id,
            usuario_id,
            tipo_asamblea,
            comite
        });
        
        res.status(201).json({ 
            success: true,
            id,
            message: 'Convencionista registrado exitosamente',
            data: {
                nombre,
                apellido,
                edad,
                sexo,
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
            data: convencionistas.map(c => ({
                id: c.id,
                nombre: c.nombre,
                apellido: c.apellido,
                edad: c.edad,
                sexo: c.sexo,
                tipo_asamblea: c.tipo_asamblea,
                tipo_matricula: c.tipo_matricula,
                tipo_pago: c.tipo_pago,
                referencia_pago: c.referencia_pago,
                monto: c.monto,
                fecha_registro: c.fecha_registro
            }))
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

const getByZona2 = async (req, res) => {
   
    
   

    try {
        const convencionistas = await Convencionista.getByZona2();

        console.log('Convencionistas obtenidos:', convencionistas)
        
        res.json({
            success: true,
            count: convencionistas.length,
            data: convencionistas.map(c => ({
                id: c.id,
                nombre: c.nombre,
                apellido: c.apellido,
                edad: c.edad,
                sexo: c.sexo,
                tipo_asamblea: c.tipo_asamblea,
                tipo_matricula: c.tipo_matricula,
                tipo_pago: c.tipo_pago,
                referencia_pago: c.referencia_pago,
                monto: c.monto,
                fecha_registro: c.fecha_registro,
                comite: c.comite
            }))
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
        
        // Formateamos estadísticas
        const formatStats = (data) => {
            return data.reduce((acc, curr) => {
                acc[curr[Object.keys(curr)[0]]] = curr.cantidad;
                return acc;
            }, {});
        };

        res.json({
            success: true,
            data: {
                total: stats.total,
                porTipoMatricula: formatStats(stats.porTipoMatricula),
                porTipoPago: formatStats(stats.porTipoPago),
                porTipoAsamblea: formatStats(stats.porTipoAsamblea),
                porSexo: formatStats(stats.porSexo),
                montoTotal: stats.montoTotal || 0
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
            message: 'Tipo de participación actualizado',
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

const updateSexo = async (req, res) => {
    const { id } = req.params;
    const { sexo } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: 'ID es requerido'
        });
    }

    try {
        const updated = await Convencionista.updateSexo(id, sexo);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Convencionista no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Sexo actualizado',
            data: { id, sexo }
        });
    } catch (error) {
        console.error('Error en updateSexo:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al actualizar',
            details: error.message
        });
    }
};

module.exports = { 
    create, 
    create2,
    getByZona,
    getByZona2, 
    getStats, 
    updateTipoAsamblea,
    updateSexo
};