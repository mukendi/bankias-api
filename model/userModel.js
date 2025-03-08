const pool = require('../config/db')

const User = {
  create: async (username, email, hashedPassword, role) => {
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email, hashedPassword, role]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query("SELECT  FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }
};

module.exports = User;
