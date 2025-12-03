import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import historyRoutes from './routes/history.js';
import collectionsRoutes from './routes/collections.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.Frontend_URL,
  credentials: true
}));

app.use(express.json());

// Public routes
app.post('/api/proxy', async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;

   const response = await axios({
  method: method || 'GET',
  url,
  headers: headers || {},
  data: body,
  // timeout: 10000,
  withCredentials: true // <-- THIS IS REQUIRED
});


    res.json({
      status: response.status,
      headers: response.headers,
      data: response.data
    });
  } catch (error) {
    console.error("Proxy error:", error);

    res.status(500).json({
      error: error.message,
      status: error.response?.status
    });
  }
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/history', historyRoutes);
app.use('/api/collections', collectionsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API Testing Tool Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
