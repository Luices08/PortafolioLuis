const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[32mIniciando Portfolio AI en modo producción local...\x1b[0m');

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
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim().length > 0) target.write(prefix + line + '\n');
      }
    });
    stream.on('end', () => {
      if (buffer.trim().length > 0) target.write(prefix + buffer + '\n');
    });
  }

  pipeOutput(child.stdout, process.stdout);
  pipeOutput(child.stderr, process.stderr);
  children.push(child);
  return child;
}

spawnService('backend', '\x1b[36m', backendDir, ['start']);
spawnService('frontend', '\x1b[35m', frontendDir, ['start']);

function cleanup() {
  console.log('\n\x1b[33mDeteniendo servicios...\x1b[0m');
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
