import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token, name: user.name, email: user.email });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //user exist check
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!name) {
            return res.json({ success: false, message: "Please enter a username" });
        }
        // validating username, email format and strong password
        if (!validator.isAlpha(name.replace(/\s/g, ""))) {
            return res.json({ success: false, message: "Please enter a valid username" });
        }
        if(name.replace(/\s/g, "").length < 5) {
            return res.json({ success: false, message: "Username must be at least 5 characters long" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token, name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//update user Address
const updateAddress = async (req, res) => {
    try {
        const { email, address } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exists" });
        }           
        user.address = address;
        await user.save();
        res.json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }       
};

//get user address
const getAddress = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exists" });
        }
        res.json({ success: true, address: user.address });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }   
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, updateAddress, getAddress };
