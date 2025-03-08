const pool = require("../config/db");

const Worker = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM workers");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM workers WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (nom, prenom, postnom, email, sexe, phone, categorie, photo_profile) => {
    const result = await pool.query(
      "INSERT INTO workers (nom, prenom, postnom, email , sexe, phone, categorie, photo_profile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [nom, prenom, postnom, email, sexe, phone, categorie, photo_profile]
    );
    return result.rows[0];
  },

  update: async (id, nom, prenom, postnom, sexe, phone, categorie, photo_profile) => {
    const result = await pool.query(
      "UPDATE workers SET nom=$1, prenom=$2, postnom=$3, sexe=$4, phone=$5, categorie=$6, photo_profile=$7 WHERE id=$8 RETURNING *",
      [nom, prenom, postnom, sexe, phone, categorie, photo_profile, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM workers WHERE id = $1", [id]);
  }
};

module.exports = Worker;
