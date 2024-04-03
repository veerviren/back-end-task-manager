const express = require('express')
const router = express.Router()

import { getAllTasks, createTask, deleteOneTask, updateOneTask } from "../controllers/taskController"

import { userAuth } from "../middleware/jwt.middleware";

router.use(userAuth);

console.log("taskRoutes called");

router.get("/", getAllTasks);
router.post("/", createTask);
router.patch("/delete/:id", deleteOneTask);
router.patch("/update/:id", updateOneTask);



module.exports = router;