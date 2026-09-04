const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Validar que existan node_modules
const hasBackendModules = fs.existsSync(path.join(backendDir, 'node_modules'));
const hasFrontendModules = fs.existsSync(path.join(frontendDir, 'node_modules'));

if (!hasBackendModules || !hasFrontendModules) {
  console.warn('\x1b[33m[aviso] Faltan dependencias instaladas en backend o frontend.\x1b[0m');
  console.warn('\x1b[33m[aviso] Ejecuta "npm run install:all" para instalarlas todas.\x1b[0m\n');
}

console.log('\x1b[32m%s\x1b[0m', '==================================================');
console.log('\x1b[32m%s\x1b[0m', '   Iniciando Portfolio AI en modo local (dev)   ');
console.log('\x1b[32m%s\x1b[0m', '   Backend:  http://localhost:4000               ');
console.log('\x1b[32m%s\x1b[0m', '   Frontend: http://localhost:3000               ');
console.log('\x1b[32m%s\x1b[0m', '==================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const children = [];

function spawnService(name, color, cwd, args) {
  const child = spawn(npmCmd, args, {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  });

  const prefix = `${color}[${name}]\x1b[0m `;

  function pipeOutput(stream, target) {
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // conservar resto incompleto
      for (const line of lines) {
        if (line.trim().length > 0) {
          target.write(prefix + line + '\n');
        }
      }
    });
    stream.on('end', () => {
      if (buffer.trim().length > 0) {
        target.write(prefix + buffer + '\n');
      }
    });
  }

  pipeOutput(child.stdout, process.stdout);
  pipeOutput(child.stderr, process.stderr);

  child.on('error', (err) => {
    console.error(`${prefix} Error al iniciar el proceso:`, err);
  });

  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${prefix} Proceso finalizado con código ${code}`);
    }
  });

  children.push(child);
  return child;
}

const backend = spawnService('backend', '\x1b[36m', backendDir, ['run', 'dev']);
const frontend = spawnService('frontend', '\x1b[35m', frontendDir, ['run', 'dev']);

function cleanup() {
  console.log('\n\x1b[33mDeteniendo servicios locales...\x1b[0m');
  for (const child of children) {
    if (child && !child.killed) {
      if (isWindows && child.pid) {
        try {
          spawn('taskkill', ['/pid', child.pid.toString(), '/T', '/F']);
        } catch (_) {
          child.kill('SIGINT');
        }
      } else {
        child.kill('SIGINT');
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
