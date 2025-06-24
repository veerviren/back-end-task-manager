// Simple script to check if environment variables are loaded
require('dotenv').config();

console.log('Environment variables check:');
console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('- EMAIL_USER:', process.env.EMAIL_USER);
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'Not set');
console.log('- BASE_URL:', process.env.BASE_URL);
