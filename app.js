const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Map();

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // Set a default username for new connections
    socketsConnected.set(socket.id, 'Anonymous');
    io.emit('clients-total', socketsConnected.size);

    //Handle username updates
    socket.on('update-username', (data) => {
        const newUsername = data.username || 'Anonymous';
        socketsConnected.set(socket.id, newUsername);

    //     // Notify all clients about the username change
    //     io.emit('username-updated', { username: newUsername });
    });

    // Handle message events
    socket.on('message', (data) => {
        const username = socketsConnected.get(socket.id) || 'Anonymous';
        socket.broadcast.emit('chat-message', { text: data.text, username });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });
});
