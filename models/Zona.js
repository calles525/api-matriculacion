const db = require('../config/db');

class Zona {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM zonas');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM zonas WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Zona;