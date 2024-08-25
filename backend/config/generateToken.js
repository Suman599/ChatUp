const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const jwt_secret = process.env.JWT_SECRET; // Access the JWT secret from environment variables

const generateToken = (id) => {
    return jwt.sign({ id }, jwt_secret, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
