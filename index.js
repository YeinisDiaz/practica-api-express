require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const upload = multer({ dest: 'uploads/' });

app.post('/api/recursos/importar', upload.single('archivo'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let datos = [];

    if (ext === '.json') {
      datos = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      await new Promise((resolv, rej) => {
        fs.createReadStream(filePath).pipe(csv())
          .on('data', d => datos.push(d))
          .on('end', resolv).on('error', rej);
      });
    }

    for (const d of datos) {
      await db.query('INSERT INTO alumnos (nombre, matricula, carrera) VALUES (?, ?, ?)', [d.nombre, d.matricula, d.carrera]);
    }

    fs.unlinkSync(filePath);
    res.json({ mensaje: 'Importado', total: datos.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/recursos/exportar/:formato', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM alumnos');
  if (req.params.formato === 'json') {
    res.setHeader('Content-Disposition', 'attachment; filename=datos_exportados.json');
    return res.json(rows);
  } else {
    const parser = new Parser();
    const csvData = parser.parse(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=datos_exportados.csv');
    return res.send(csvData);
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));