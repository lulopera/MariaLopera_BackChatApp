import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';


// use the Server library to set up our chat infrastructure
// CORS is Cross Origin Restrictions -> security policy to avoid screw
// our CORS policy is allowing connection from ANYWHERE (not good)

// this opnes a door to our server/chat app and lets users do things

const app = express();
const httpServer = createServer(app);

const io = new Server (httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;

let users = [];

httpServer.listen (port, () => {
    console.log(`chat server up and running on ${port}`);
})

// the socket.io stuff will go here -manage incoming connections, sending notifications,
// managing users, and managing chat messages

io.on('connection', (socket) => {
    console.log('a user connected!');

    socket.emit("CONNECTED", socket.id);

    socket.on('JOINED_CHAT', function(data) {
        users.push(data);

        io.emit('JOINED', users);
    })

    socket.on('SEND_MESSAGE', function(data) {
        console.log('SEND_MESSAGE event!', data);

        io.emit('MESSAGE', data);
    })

    socket.on('USER_TYPING', (data) => {
        io.emit('SOMEONE_TYPING', data);
    })

    // socket.on('SEND_MESSAGE', function(data) {
    //     var userColorClass = $blueText;
    //     if (!this.username.trim() === "");
    
    //     io.emit('NEW_MESSAGE', data);
    
    // })
    
})