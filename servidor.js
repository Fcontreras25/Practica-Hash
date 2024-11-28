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

// Configuración de CORS combinada
app.use(cors({
  origin: ['https://practica-hash-ovkm.vercel.app', 'http://localhost:5173'], // Soporta múltiples dominios
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.options('*', cors()); // Habilitar CORS para solicitudes OPTIONS

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

// Conexión a la base de datos
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

// Configuración de rutas
app.use(setupLoginRoutes(db));
app.use(setupCrearCuentaRoutes(db));
app.use(setupRestablecerCtRoutes(db));
app.use(setupNuevaContraRoutes(db));

// Iniciar el servidor
export default app;


