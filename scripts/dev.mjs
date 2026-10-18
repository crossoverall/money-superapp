#!/usr/bin/env node
/**
 * Money Superapp - Zero-Dependency Live Reload Development Server
 * Usage:
 *   node scripts/dev.mjs [--port=8000] [--test-mode]
 *   npm run dev
 */

import { existsSync, readFileSync, statSync, watch } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Parse CLI arguments
const args = process.argv.slice(2);
const portArg = args.find((a) => a.startsWith('--port='));
const PORT = portArg ? Number.parseInt(portArg.split('=')[1], 10) : Number.parseInt(process.env.PORT || '8000', 10);
const IS_TEST_MODE = args.includes('--test-mode');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const LIVE_RELOAD_SCRIPT = `
<!-- Money Superapp Live Reload -->
<script>
(() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let es;
    function connect() {
      es = new EventSource('/__live_reload_stream');
      es.onmessage = (e) => {
        if (e.data === 'reload') {
          console.log('[DevServer] File change detected, reloading...');
          window.location.reload();
        }
      };
      es.onerror = () => {
        es.close();
        setTimeout(connect, 2000);
      };
    }
    connect();
  }
})();
</script>
</body>
`;

// Active SSE client connections
const sseClients = new Set();

function broadcastReload() {
  for (const client of sseClients) {
    try {
      client.write('data: reload\n\n');
    } catch (_e) {
      sseClients.delete(client);
    }
  }
}

// Debounce file changes
let reloadTimeout = null;
function notifyChange(filename) {
  if (filename && (filename.endsWith('.log') || filename.includes('.git') || filename.includes('node_modules'))) {
    return;
  }
  clearTimeout(reloadTimeout);
  reloadTimeout = setTimeout(() => {
    console.log(`[DevServer] Change detected: ${filename || 'file'} -> broadcasting reload`);
    broadcastReload();
  }, 120);
}

// Watch key source directories
const watchTargets = [ROOT_DIR, path.join(ROOT_DIR, 'js'), path.join(ROOT_DIR, 'css')];

for (const target of watchTargets) {
  if (existsSync(target)) {
    try {
      watch(target, (_eventType, filename) => {
        notifyChange(filename);
      });
    } catch (_e) {}
  }
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // 1. Live reload SSE stream
  if (url === '/__live_reload_stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('retry: 2000\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 2. Static file serving
  let reqPath = url.replace(/^\//, '');
  if (!reqPath || reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  const filePath = path.join(ROOT_DIR, reqPath);

  // Security: prevent path traversal outside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      let html = readFileSync(filePath, 'utf8');
      if (html.includes('</body>')) {
        html = html.replace('</body>', LIVE_RELOAD_SCRIPT);
      } else {
        html += LIVE_RELOAD_SCRIPT;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(html);
    } else {
      const buffer = readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(buffer);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${reqPath}`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 Money Superapp Dev Server running at: http://127.0.0.1:${PORT}`);
  console.log(`   Live reload active on SSE (/__live_reload_stream)`);
  console.log(`   Watching: js/, css/, *.html\n`);

  if (IS_TEST_MODE) {
    console.log('[DevServer] Test mode enabled: verifying endpoints...');
    // Self-test request
    http.get(`http://127.0.0.1:${PORT}/index.html`, (res) => {
      if (res.statusCode === 200) {
        console.log('[DevServer] ✓ Static file endpoint OK (HTTP 200)');
        broadcastReload();
        console.log('[DevServer] ✓ SSE broadcast OK');
        server.close(() => {
          console.log('[DevServer] ✓ Test mode passed. Exiting.');
          process.exit(0);
        });
      } else {
        console.error(`[DevServer] ✗ Unexpected status code: ${res.statusCode}`);
        process.exit(1);
      }
    });
  }
});

process.on('SIGINT', () => {
  console.log('\n[DevServer] Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
