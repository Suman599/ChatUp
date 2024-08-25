const jwt = require('jsonwebtoken');
const User = require("../models/userModel.js");
require('dotenv').config();

const asyncHandler = require("express-async-handler");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(" ")[1];
            
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user to request object
            req.user = await User.findById(decoded.id).select("-password");
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };
