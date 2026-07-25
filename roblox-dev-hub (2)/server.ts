import express from 'express';
import path from 'path';
import { generateRbxmContent } from './src/lib/rbxmGenerator.js';
import { SAMPLE_ASSETS } from './src/data/sampleAssets.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Download RBXM endpoint
app.get('/api/download/:assetId', (req, res) => {
  const { assetId } = req.params;
  const asset = SAMPLE_ASSETS.find((a) => a.id === assetId) || SAMPLE_ASSETS[0];

  const rbxmContent = generateRbxmContent(asset.name, asset.category, asset.codeSnippet);
  const fileName = `${asset.name.replace(/\s+/g, '')}.rbxm`;

  res.setHeader('Content-Type', 'application/x-roblox-model');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(rbxmContent);
});

// Vite server configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Roblox Dev Hub server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
