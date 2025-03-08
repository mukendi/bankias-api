const { Pool } = require('pg');
require('dotenv').config();



const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.connect()
.then(client =>{
    console.log("Connexion avec PosgreSQL réussie !");
    client.release();
})
.catch(err => console.error("Erreur de connexion à PostgreSQL!"));

const result = pool.query("SELECT * FROM users")

module.exports = pool;