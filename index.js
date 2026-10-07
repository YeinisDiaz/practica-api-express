const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let libros = [
  { id: 1, nombre: "Cien Años de Soledad", autor: "García Márquez", anio: 1967 },
  { id: 2, nombre: "Don Quijote", autor: "Cervantes", anio: 1605 },
  { id: 3, nombre: "El Principito", autor: "Saint-Exupéry", anio: 1943 }
];

app.get('/', (req, res) => {
  res.send('Servidor en línea - API REST funcionando correctamente');
});

app.get('/api/recursos', (req, res) => {
  res.status(200).json(libros);
});

app.get('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);
  if (!libro) {
    return res.status(404).json({ mensaje: "Recurso no encontrado" });
  }
  res.status(200).json(libro);
});

app.post('/api/recursos', (req, res) => {
  const nuevoLibro = {
    id: libros.length > 0? Math.max(...libros.map(l => l.id)) + 1 : 1,
    nombre: req.body.nombre,
    autor: req.body.autor,
    anio: req.body.anio
  };
  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

app.put('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = libros.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ mensaje: "Recurso no encontrado" });
  }
  libros[index] = {...libros[index],...req.body, id: id };
  res.status(200).json(libros[index]);
});

app.delete('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = libros.findIndex(l => l.id === id);
  if (index === -1) {
    return res.status(404).json({ mensaje: "Recurso no encontrado" });
  }
  libros.splice(index, 1);
  res.status(200).json({ mensaje: `Recurso con ID ${id} eliminado` });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});