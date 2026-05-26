import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

//global variables
const currency = "inr";
const deliveryCharge = 10;

const checkProductStock = async (items) => {
    for (const item of items) {
        console.log("from the backend", item);
        const product = await productModel.findById(item._id);
        if (!product) {
            throw new Error("Product not found");
            return false;
        }
        if (product.quantity < item.quantity) {
            throw new Error(`${product.name} only has ${product.quantity} items left`);
            return false;
        } else {
            console.log(`${product.name} has enough stock`);
            return true;
        }
    }
};

const updateProductStock = async (items) => {
    for (const item of items) {
        const product = await productModel.findById(item._id);

        if (!product) {
            throw new Error("Product not found");
            return false;
        }
        if (product.quantity < item.quantity) {
            throw new Error(`${product.name} only has ${product.quantity} items left`);
            return false;
        } else {
            console.log(`${product.name} has enough stock`);
        }

        const updatedQuantity = product.quantity - item.quantity;

        await productModel.findByIdAndUpdate(item._id, {
            quantity: updatedQuantity,
            inStock: updatedQuantity > 0,
        });
    }
};

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//placing order using cod method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const checkStock = await checkProductStock(items);

        if (checkStock === true) {
            const newOder = new orderModel(orderData);
            await newOder.save();

            await updateProductStock(items);

            await userModel.findByIdAndUpdate(userId, { cartData: {} });
        }

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//placing order using stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };

        await checkProductStock(items);

        const newOder = new orderModel(orderData);
        await newOder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//verify stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            const order = await orderModel.findById(orderId);

            await updateProductStock(order.items);
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//placing order using razorpay method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        };

        await checkProductStock(items);

        const newOder = new orderModel(orderData);
        await newOder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOder._id.toString(),
        };

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// verify razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === "paid") {
            const order = await orderModel.findById(orderInfo.receipt);

            await updateProductStock(order.items);

            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// all orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// user order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// update order status for admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//monthly order data for graph

const getMonthlyOrders = async (req, res) => {
    try {
        const orders = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date("2026-05-01"),
                        $lte: new Date("2026-05-31"),
                    },
                },
            },

            {
                $group: {
                    _id: { $dayOfMonth: "$createdAt" },

                    orders: { $sum: 1 },
                },
            },

            {
                $sort: { _id: 1 },
            },
        ]);

        const formatted = orders.map((item) => ({
            day: item._id,
            orders: item.orders,
        }));
        const daysInMonth = 31;

        const fullData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const found = formatted.find((item) => item.day === day);

            fullData.push({
                day,
                orders: found ? found.orders : 0,
            });
        }

        res.json(fullData);
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    verifyStripe,
    placeOrderRazorpay,
    verifyRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    getMonthlyOrders,
};
