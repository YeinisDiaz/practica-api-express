const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = 3000;
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'api_practica',
  waitForConnections: true,
  connectionLimit: 10
});

pool.getConnection()
.then(conn => {
    console.log("Conectado exitosamente a la base de datos");
    conn.release();
  })
.catch(err => console.error("Error de conexión:", err));

app.get('/', (req, res) => {
  res.send('Servidor en línea - API REST funcionando correctamente');
});

app.get('/api/recursos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM libros');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recursos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM libros WHERE id =?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Recurso no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recursos', async (req, res) => {
  try {
    const { nombre, autor, anio } = req.body;
    const [result] = await pool.query('INSERT INTO libros (nombre, autor, anio) VALUES (?,?,?)', [nombre, autor, anio]);
    res.status(201).json({ id: result.insertId, nombre, autor, anio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recursos/:id', async (req, res) => {
  try {
    const { nombre, autor, anio } = req.body;
    await pool.query('UPDATE libros SET nombre=?, autor=?, anio=? WHERE id=?', [nombre, autor, anio, req.params.id]);
    res.json({ mensaje: "Recurso actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recursos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM libros WHERE id=?', [req.params.id]);
    res.json({ mensaje: "Recurso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));