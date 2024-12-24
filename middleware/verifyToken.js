const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const verifyToken = async (req, res, next) => {
    console.log("Request Headers:", req.headers); // Debugging incoming headers
    const token = req.headers.token; // Extracting the token

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, secretKey); // Verify token
        const vendor = await Vendor.findById(decoded.vendorId); // Validate vendor existence

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        req.vendorId = vendor._id; // Attach vendor ID to request
        next(); // Proceed to next middleware
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
