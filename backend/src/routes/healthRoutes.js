const express = require('express');
const router = express.Router();
const { isDatabaseConnected } = require('../config/db');

router.get('/', (req, res) => {
  const dbStatus = isDatabaseConnected() ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'healthy',
    store: 'MR SM Multi Brand Store',
    proprietor: 'Mr. Shiva Yadav',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

module.exports = router;
