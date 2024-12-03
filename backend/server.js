const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require('dotenv').config();

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
// Connect to the database
connectDB();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chatup-v8fv.onrender.com/", // Adjust according to your frontend URL
        methods: ["GET", "POST"]
    }
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });
    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
});

// Serve static files from the React app
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, 'frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}

// Define API routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server
server.listen(5001, () => {
    console.log("Server started on port 5001");
});
