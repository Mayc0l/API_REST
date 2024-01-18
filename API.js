const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuración de la conexión a la base de datos.
const pool = new Pool({
    user: "postgres",
  host: "localhost",
  database: "db_curso_app",
  password: "199920",
  port: 5432,
});

// Para poder insertar datos
app.post('/insert', async (req, res) => {
  try {
    const { cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    const result = await pool.query('INSERT INTO esq_datos_personales.persona (cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar datos' });
  }
});

// Para actualizar datos
app.post('/update', async (req, res) => {
  try {
    const { idpersona, cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion } = req.body;
    const result = await pool.query('UPDATE esq_datos_personales.persona SET cedula=$2, nombres=$3, apellidos=$4, fecha_nacimiento=$5, telefono=$6, direccion=$7 WHERE idpersona=$1 RETURNING *', [idpersona, cedula, nombres, apellidos, fecha_nacimiento, telefono, direccion]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar datos' });
  }
});

// Para poder seleccionar datos
app.post('/select', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM esq_datos_personales.persona');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al seleccionar datos' });
  }
});


// Para poder eliminar datos
app.post('/delete', async (req, res) => {
  try {
    const { idpersona } = req.body;
    const result = await pool.query('DELETE FROM esq_datos_personales.persona WHERE idpersona=$1 RETURNING *', [idpersona]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar datos' });
  }
});

// Para poder buscar datos con condición WHERE
app.post('/where', async (req, res) => {
  try {
    const { cedula } = req.body;
    const result = await pool.query('SELECT * FROM esq_datos_personales.persona WHERE cedula=$1', [cedula]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al seleccionar datos con condición WHERE' });
  }
});

app.listen(3000);
console.log("Servidor iniciado. API REST");