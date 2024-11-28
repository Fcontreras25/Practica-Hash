import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import setupCrearCuentaRoutes from './src/backend/crearCuenta.js';
import setupRestablecerCtRoutes from './src/backend/restablecerCt.js';
import setupNuevaContraRoutes from './src/backend/nuevaContra.js';
import setupLoginRoutes from './src/backend/login.js';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'https://practica-hash.vercel.app', // Dominio del frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type'],}));
app.use(bodyParser.json());

app.use('/recursos', express.static('recursos'));

// Configuración de la conexión a la base de datos
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Necesario para conexiones seguras con Neon
});

// Probar la conexión a la base de datos
(async () => {
  try {
    await db.query('SELECT 1'); // Consulta de prueba
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
  }
})();

// Configurar rutas con db
app.use('/recursos', express.static('src/backend/recursos'));
app.use(setupLoginRoutes(db));
app.use(setupCrearCuentaRoutes(db));
app.use(setupRestablecerCtRoutes(db));
app.use(setupNuevaContraRoutes(db));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});