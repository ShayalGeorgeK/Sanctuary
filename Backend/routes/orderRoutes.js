import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
    allOrders,
    getMonthlyOrders,
    placeOrder,
    placeOrderRazorpay,
    placeOrderStripe,
    totalSalesOrdersCustomers,
    updateStatus,
    userOrders,
    verifyRazorpay,
    verifyStripe,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// payment features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

//user feature
orderRouter.post("/userorders", authUser, userOrders);

//verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

//for home page stats
orderRouter.get("/monthly", getMonthlyOrders);
orderRouter.post("/total", totalSalesOrdersCustomers);

export default orderRouter;
