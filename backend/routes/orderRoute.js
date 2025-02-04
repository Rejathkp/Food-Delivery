import express from "express"
import authMiddleware from "../middleware/auth.js"
import {placeOrder,allOrders,userOrders,updateStatus} from "../controllers/orderController.js"

const orderRouter = express.Router()

// Admin Features
orderRouter.get('/list',allOrders)
orderRouter.post('/status',updateStatus)

// Payment Features
orderRouter.post("/place",authMiddleware,placeOrder)

// User Features
orderRouter.post("/userorders",authMiddleware,userOrders)

export default orderRouter;