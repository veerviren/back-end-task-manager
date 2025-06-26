import express from 'express';
const cors = require('cors')
const userRoutes = require("./routes/userRoutes")

const productRoutes = require("./routes/productRoutes")
import dotenv from "dotenv";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Swagger
setupSwagger(app);

// Add a health check endpoint for Cloud Run
app.get('/_health', (req, res) => {
  res.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/user", userRoutes);
app.use('/products', productRoutes);

const port = parseInt(process.env.PORT || '8080', 10); // Ensure port is a number
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on 0.0.0.0:${port}`);
});
