const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log('[' + timestamp + '] ' + req.method + ' ' + req.url);

    // Strip querystring/hash (e.g. /js/app.js?v=2) so local server can find files
    let pathname;
    try {
        const url = new URL(req.url, 'http://localhost');
        pathname = url.pathname;
    } catch {
        pathname = req.url;
    }

    // Default document
    if (pathname === '/' || pathname === '') pathname = '/index.html';

    // Prevent path traversal and map to local filesystem
    const decodedPath = decodeURIComponent(pathname);
    const safePath = path.normalize(decodedPath).replace(/^([\\/])+/, '');
    const filePath = path.join('.', safePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n=== WINTER THEME LOCAL SERVER ===\n');
    console.log('Server running at: http://localhost:' + PORT);
    console.log('Open: http://localhost:' + PORT + '/index.html\n');
    console.log('Test checklist:');
    console.log('  1. Click snowflake button (top-right)');
    console.log('  2. Watch snow fall');
    console.log('  3. See tree (bottom-right)');
    console.log('  4. Click tree for snow burst');
    console.log('  5. Click snowflake again to disable\n');
    console.log('Press Ctrl+C to stop server');
    console.log('=================================\n');
});