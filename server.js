const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    const { id } = socket;
    console.log("connected with id", id);

    socket.on("chat message", (message) => {
        console.log(message, `from ${socket.id}`);
        io.emit("chat message", message);
    });

    socket.on("typing", (user) => {
        console.log(user, "is typing");
        socket.broadcast.emit("typing", user);
    });
    socket.on("not typing", (user) => {
        console.log(user, "has stopped typing");
        socket.broadcast.emit("not typing", user);
    });

    socket.on("disconnect", () => {
        console.log("User diconnected");
    });
});
// io.on("connection", (socket) => {
//     socket.on("chat message", (message) => {
//         console.log(message);
//         // socket.broadcast.emit("chat message", message);
//         socket.emit("chat message", message);
//     });
// });
// io.on("connection", (socket) => {
//     socket.broadcast.emit("greetings");
//     console.log("a user connected");
//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     });
// });
const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running at port :${PORT}`);
});
