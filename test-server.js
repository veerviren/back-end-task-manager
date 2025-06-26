# Super minimal Express server for testing Cloud Run
const express = require('express');
const app = express();

// Get the PORT from environment variable
const port = parseInt(process.env.PORT || '8080', 10);

// Add routes
app.get('/', (req, res) => {
  res.send({
    message: 'Hello from Simple Test Server!',
    timestamp: new Date().toISOString()
  });
});

app.get('/env', (req, res) => {
  // Only show safe environment variables
  const safeEnv = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  };
  
  res.send({
    environment: safeEnv,
    hostname: require('os').hostname(),
    platform: process.platform,
    nodeVersion: process.version,
    uptime: process.uptime()
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current directory:', __dirname);
});
