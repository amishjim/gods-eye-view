import { preview } from 'vite';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);

const server = await preview({
  configFile: './vite.config.js',
  mode: 'production',
  preview: {
    host,
    port,
    strictPort: true,
  },
});

console.log(`God's Eye View production server listening on ${host}:${port}`);

const shutdown = async (signal) => {
  console.log(`${signal} received; shutting down.`);
  await server.close();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
