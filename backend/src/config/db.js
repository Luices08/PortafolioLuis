const mongoose = require('mongoose');
const config = require('./env');

async function connectDB() {
  if (!config.mongoUri) {
    console.error('[db] MONGODB_URI no está definido. El servidor arrancará pero las rutas que usan la base de datos fallarán.');
    return;
  }

  if (config.mongoUri.includes('cluster.mongodb.net')) {
    console.warn('[db] ADVERTENCIA: MONGODB_URI en backend/.env usa la URL de ejemplo ("cluster.mongodb.net"). Configura una URI real (MongoDB Atlas o local mongodb://127.0.0.1:27017/portfolio-ai).');
  }

  try {
    mongoose.set('strictQuery', true);
    mongoose.set('bufferCommands', false); // si no hay conexión, falla rápido en vez de colgar la petición
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[db] Conectado a MongoDB');
  } catch (error) {
    // Si estamos dentro de Docker (VPS) y la URI apuntaba a 127.0.0.1 o localhost, reintentar con el host del servicio 'mongodb'
    const fs = require('fs');
    const isDocker = fs.existsSync('/.dockerenv') || Boolean(process.env.DOCKER_CONTAINER);

    if (isDocker && config.mongoUri && (config.mongoUri.includes('127.0.0.1') || config.mongoUri.includes('localhost'))) {
      const dockerUri = config.mongoUri
        .replace('127.0.0.1', 'mongodb')
        .replace('localhost', 'mongodb');
      try {
        console.log(`[db] Reintentando conexión con host de Docker: ${dockerUri}...`);
        await mongoose.connect(dockerUri, { serverSelectionTimeoutMS: 3000 });
        console.log('[db] Conectado a MongoDB (vía red Docker)');
        return;
      } catch (_) {
        // Si también falla, loguear el error original
      }
    }
    console.error('[db] Error al conectar a MongoDB:', error.message);
    // No tumbamos el proceso: útil en entornos de demo/desarrollo donde
    // el resto del servidor (estático, health check) debe seguir vivo.
  }

  mongoose.connection.on('error', (err) => {
    console.error('[db] Error de conexión:', err.message);
  });
}

module.exports = connectDB;
