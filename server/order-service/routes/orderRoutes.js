import express from "express"
import { createOrder, getOrdersByUser, getOrderById, cancelOrder } from "../controllers/orderController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/orders", verifyToken, createOrder)
router.get("/orders/user/:userId", verifyToken, getOrdersByUser)
router.get("/orders/:id", verifyToken, getOrderById)
router.delete("/orders/:id", verifyToken, cancelOrder)

export default router
