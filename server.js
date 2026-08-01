const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Check if production build exists in .next directory
const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
const hasProductionBuild = fs.existsSync(buildIdPath);

// Determine dev mode: fallback to dev compilation if .next build is missing
const isProductionEnv = process.env.NODE_ENV === 'production';
const dev = !isProductionEnv || !hasProductionBuild;

const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 6000;

if (isProductionEnv && !hasProductionBuild) {
  console.warn('> WARNING: No .next production build found in directory.');
  console.warn('> Starting server in dynamic mode. For optimal performance, run "npm run build" on your server.');
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Curry Puff Counter Server running on port ${port} (mode: ${dev ? 'development/dynamic' : 'production'})`);
  });
});
