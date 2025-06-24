const express = require('express')
const router = express.Router()

import { getAllProducts, createProduct, deleteOneProduct, updateOneProduct } from "../controllers/productController"

import { userAuth } from "../middleware/jwt.middleware";

router.use(userAuth);

console.log("productRoutes called");

router.get("/", getAllProducts);
router.post("/", createProduct);
router.patch("/delete/:id", deleteOneProduct);
router.patch("/update/:id", updateOneProduct);



module.exports = router;
