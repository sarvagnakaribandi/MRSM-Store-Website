const express = require('express');
const cors = require('cors');

// Route Handlers
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const offerRoutes = require('./routes/offerRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Middlewares
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server) or localhost
      if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local demo testing
      }
    },
    credentials: true
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Endpoints
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contact', contactRoutes);

// Catch 404 for unhandled API routes
app.use(notFoundHandler);

// Centralized error middleware
app.use(errorHandler);

module.exports = app;
