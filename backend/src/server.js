const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`[server] portfolio-ai backend escuchando en http://localhost:${config.port}`);
    console.log(`[server] entorno: ${config.nodeEnv}`);
  });
}

start();
