import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import setupCrearCuentaRoutes from './crearCuenta.js';
import setupRestablecerCtRoutes from './restablecerCt.js';
import setupNuevaContraRoutes from './nuevaContra.js';
import setupLoginRoutes from './login.js';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/recursos', express.static('recursos'));

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Necesario para conexiones seguras con Vercel Postgres
});

db.connect()
  .then(() => console.log('Conexión con la base de datos establecida'))
  .catch((err) => console.error('Error con la conexión a la base de datos:', err));

app.use('/recursos', express.static('src/backend/recursos')); 

// Configurar rutas con db
app.use(setupLoginRoutes(db));
app.use(setupCrearCuentaRoutes(db));
app.use(setupRestablecerCtRoutes(db));
app.use(setupNuevaContraRoutes(db));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
