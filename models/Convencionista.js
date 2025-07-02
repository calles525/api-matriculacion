const db = require('../config/db');

class Convencionista {
    static async create({ nombre, apellido, edad, tipo_matricula, tipo_pago, referencia_pago, monto, zona_id, usuario_id }) {
        const [result] = await db.query(
            'INSERT INTO convencionistas (nombre, apellido, edad, tipo_matricula, tipo_pago, referencia_pago, monto, zona_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, edad, tipo_matricula, tipo_pago, referencia_pago, monto, zona_id, usuario_id]
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
        
        return {
            total: total[0].total,
            porTipoMatricula,
            porTipoPago,
            montoTotal: montoTotal[0].total || 0
        };
    }
}

module.exports = Convencionista;