import express from 'express';
const cors = require('cors')
const userRoutes = require("./routes/userRoutes")

const taskRoutes = require("./routes/taskRoutes")
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use('/tasks', taskRoutes);

const port = process.env.PORT || 3001; // Using process.env.PORT if available, otherwise default to 3001
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
