const socket = io();
const users = ["chomba", "felix", "bryan"];
const user = users[Math.floor(Math.random() * users.length)];

const form = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messageDisplay = document.getElementById("messageDisplay");
const notif = document.getElementById("notif");

console.log(user, "connected");
function handleFormSubmit(e) {
    e.preventDefault();
    const message = {
        id: Math.random(),
        sender: user,
        message: messageInput.value,
        date: Date.now(),
    };
    socket.emit("chat message", message);
    messageInput.value = "";
    // console.log("submiting", messageInput.value);
}

const typingStatus = (isTyping, user) => {
    if (isTyping)
        document.getElementById("typingStatus").innerText = user + "is typing";
    if (!isTyping) document.getElementById("typingStatus").innerText = "";
};
const handleInputFocusIn = (user) => {
    socket.emit("typing", user);
    // console.log("dont blink", user);
};
const handleInputFocusOut = (user) => {
    socket.emit("not typing", user);
    // console.log("you can blink");
};

const ifUserIsSender = (sender, user) => {
    return sender === user ? "you" : sender;
};

// sockets

socket.on("chat message", (message) => {
    console.log(message, "from server");
});
socket.on("typing", (user) => {
    typingStatus(true, user);
});
socket.on("not typing", (user) => {
    typingStatus(false, user);
    // console.log(user, "stopped typing");
});
socket.on("chat message", function (msg) {
    const item = document.createElement("li");
    item.textContent = msg.message + " - " + ifUserIsSender(msg.sender, user);
    messageDisplay.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// events
form.addEventListener("submit", handleFormSubmit);
messageInput.addEventListener("focusin", () => {
    handleInputFocusIn(user);
});
messageInput.addEventListener("focusout", () => {
    handleInputFocusOut(user);
});

// injections
document.getElementById("userDialogue").innerText = user;
