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

app.use("/user", userRoutes);
app.use('/products', productRoutes);

const port = process.env.PORT || 8080; // Using process.env.PORT if available, otherwise default to 8080 for Cloud Run
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
