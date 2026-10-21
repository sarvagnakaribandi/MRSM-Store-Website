const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database & Server
const startServer = async () => {
  // Attempt DB Connection
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 MR SM Multi Brand Store API running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Products API: http://localhost:${PORT}/api/products`);
    console.log(`   Categories:   http://localhost:${PORT}/api/categories`);
    console.log(`   Offers API:   http://localhost:${PORT}/api/offers`);
    console.log(`======================================================\n`);
  });

  // Graceful Shutdown
  const gracefulShutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

startServer();
