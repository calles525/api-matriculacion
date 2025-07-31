const db = require('../config/db');

class Convencionista {
    static async create({ 
        nombre, 
        apellido, 
        edad, 
        sexo, 
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto, 
        zona_id, 
        usuario_id, 
        tipo_asamblea
    }) {
        // Validamos los valores permitidos para tipo_asamblea
        const tiposAsambleaValidos = ['Asambleista', 'Niño', 'Visita'];
        const tipoAsambleaFinal = tiposAsambleaValidos.includes(tipo_asamblea) ? tipo_asamblea : 'Visita';
        
        // Validamos los valores permitidos para sexo
        const sexosValidos = ['Masculino', 'Femenino', 'Otro', null];
        const sexoFinal = sexosValidos.includes(sexo) ? sexo : null;
        
        const [result] = await db.query(
            'INSERT INTO convencionistas (nombre, apellido, edad, sexo, tipo_matricula, tipo_pago, referencia_pago, monto, zona_id, usuario_id, tipo_asamblea) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                nombre, 
                apellido, 
                edad, 
                sexoFinal, 
                tipo_matricula, 
                tipo_pago, 
                referencia_pago, 
                monto, 
                zona_id, 
                usuario_id, 
                tipoAsambleaFinal
            ]
        );
        return result.insertId;
    }

     static async create2({ 
        nombre, 
        apellido, 
        edad, 
        sexo, 
        tipo_matricula, 
        tipo_pago, 
        referencia_pago, 
        monto, 
        zona_id, 
        usuario_id, 
        tipo_asamblea = 'Visita',
        comite  // Nuevo valor por defecto
    }) {
        // Validamos los valores permitidos para tipo_asamblea
        const tiposAsambleaValidos = ['Asambleista', 'Niño', 'Visita'];
        const tipoAsambleaFinal = tiposAsambleaValidos.includes(tipo_asamblea) ? tipo_asamblea : 'Visita';
        
        // Validamos los valores permitidos para sexo
        const sexosValidos = ['Masculino', 'Femenino', 'Otro', null];
        const sexoFinal = sexosValidos.includes(sexo) ? sexo : null;
        
        const [result] = await db.query(
            'INSERT INTO convencionistas (nombre, apellido, edad, sexo, tipo_matricula, tipo_pago, referencia_pago, monto, zona_id, usuario_id, tipo_asamblea,comite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                nombre, 
                apellido, 
                edad, 
                sexoFinal, 
                tipo_matricula, 
                tipo_pago, 
                referencia_pago, 
                monto, 
                zona_id, 
                usuario_id, 
                tipoAsambleaFinal,
                comite
            ]
        );
        return result.insertId;
    }

    static async getByZona(zona_id) {
        const [rows] = await db.query(
            'SELECT * FROM convencionistas WHERE zona_id = ? ORDER BY fecha_registro DESC',
            [zona_id]
        );
        return rows;
    }

      static async getByZona2(zona_id) {
        const [rows] = await db.query(
            'SELECT * FROM convencionistas ORDER BY fecha_registro DESC',
            [zona_id]
        );
        return rows;
    }

    static async getStatsByZona(zona_id) {
        const [total] = await db.query(
            'SELECT COUNT(*) as total FROM convencionistas WHERE zona_id = ?',
            [zona_id]
        );
        
        const [porTipoMatricula] = await db.query(
            'SELECT tipo_matricula, COUNT(*) as cantidad FROM convencionistas WHERE zona_id = ? GROUP BY tipo_matricula',
            [zona_id]
        );
        
        const [porTipoPago] = await db.query(
            'SELECT tipo_pago, COUNT(*) as cantidad FROM convencionistas WHERE zona_id = ? GROUP BY tipo_pago',
            [zona_id]
        );
        
        const [montoTotal] = await db.query(
            'SELECT SUM(monto) as total FROM convencionistas WHERE zona_id = ?',
            [zona_id]
        );

        const [porTipoAsamblea] = await db.query(
            'SELECT tipo_asamblea, COUNT(*) as cantidad FROM convencionistas WHERE zona_id = ? GROUP BY tipo_asamblea',
            [zona_id]
        );

        const [porSexo] = await db.query(
            'SELECT sexo, COUNT(*) as cantidad FROM convencionistas WHERE zona_id = ? GROUP BY sexo',
            [zona_id]
        );
        
        return {
            total: total[0].total,
            porTipoMatricula,
            porTipoPago,
            montoTotal: montoTotal[0].total || 0,
            porTipoAsamblea,
            porSexo
        };
    }

    static async updateTipoAsamblea(id, tipo_asamblea) {
        const tiposValidos = ['Asambleísta', 'Niño', 'Visita'];
        const tipoAsambleaFinal = tiposValidos.includes(tipo_asamblea) ? tipo_asamblea : 'Visita';
        
        const [result] = await db.query(
            'UPDATE convencionistas SET tipo_asamblea = ? WHERE id = ?',
            [tipoAsambleaFinal, id]
        );
        return result.affectedRows > 0;
    }

    static async updateSexo(id, sexo) {
        const sexosValidos = ['Masculino', 'Femenino', 'Otro', null];
        const sexoFinal = sexosValidos.includes(sexo) ? sexo : null;
        
        const [result] = await db.query(
            'UPDATE convencionistas SET sexo = ? WHERE id = ?',
            [sexoFinal, id]
        );
        return result.affectedRows > 0;
    }

    // Método para obtener conteo por tipo de asamblea
    static async countByTipoAsamblea(zona_id = null) {
        let query = 'SELECT tipo_asamblea, COUNT(*) as cantidad FROM convencionistas';
        const params = [];
        
        if (zona_id) {
            query += ' WHERE zona_id = ?';
            params.push(zona_id);
        }
        
        query += ' GROUP BY tipo_asamblea';
        
        const [result] = await db.query(query, params);
        return result;
    }
}

module.exports = Convencionista;