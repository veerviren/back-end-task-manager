/**
 * Simple server for testing Cloud Run deployment
 */
const express = require('express');
const app = express();

// Get the PORT from environment variable
const port = parseInt(process.env.PORT || '8080', 10);

app.get('/', (req, res) => {
  res.send({
    message: 'Hello from Campus Exchange!',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
