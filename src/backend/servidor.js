import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';

import setupCrearCuentaRoutes from './crearCuenta.js';
import setupRestablecerCtRoutes from './restablecerCt.js';
import setupNuevaContraRoutes from './nuevaContra.js';
import setupLoginRoutes from './login.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'usuario',
  database: 'login',
});

db.connect((err) => {
  if (err) {
    console.error('Error con la conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión con la base de datos establecida');
});

// Configurar rutas con db
app.use(setupLoginRoutes(db));
app.use(setupCrearCuentaRoutes(db));
app.use(setupRestablecerCtRoutes(db));
app.use(setupNuevaContraRoutes(db));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
