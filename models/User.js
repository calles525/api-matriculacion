const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(username, password, zona_id, nombre_completo, email) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO usuarios (username, password, zona_id, nombre_completo, email) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, zona_id, nombre_completo, email]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT id, username, zona_id, nombre_completo, email FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;