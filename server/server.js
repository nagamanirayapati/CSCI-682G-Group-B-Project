const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user'); // Ensure this is correctly set
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

// Use cors middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Synchronize indexes
    await User.syncIndexes();
    console.log("Indexes synchronized successfully");
  })
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Socket.IO for real-time events
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('checkUsername', async (username) => {
    const isTaken = await User.exists({ username });
    socket.emit('usernameChecked', { username, isAvailable: !isTaken });
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(5000, () => console.log('Server running on port 5000'));
