const db = require('../database/db');

class Mask {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM masks');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM masks WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateStock(id, stock) {
    await db.query('UPDATE masks SET stock = ? WHERE id = ?', [stock, id]);
  }
}

module.exports = Mask; 