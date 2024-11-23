const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('massage-containner');
const clientsTotal = document.getElementById('clients-total');
const usernameInput = document.getElementById('name-input'); // Username input field

let currentUsername = usernameInput.value.trim() || 'Anonymous';

// Emit message when form is submitted
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;

    if (message) {
        socket.emit('message', { text: message, username: currentUsername });
        addMessageToChat(` ${message}`, 'message-right');
        messageInput.value = ''; // Clear the input field after sending
    }
});

// Listen for changes to the username field
usernameInput.addEventListener('input', () => {
    const newUsername = usernameInput.value.trim() || 'Anonymous';
    if (newUsername !== currentUsername) {
        currentUsername = newUsername;
        socket.emit('update-username', { username: currentUsername });
    }
});

// Update message container with received message
socket.on('chat-message', (data) => {
    addMessageToChat(`from ${data.username}:`);
    addMessageToChat(`${data.text}`, 'message-left');
});

// Update client count
socket.on('clients-total', (count) => {
    clientsTotal.textContent = `Total Client : ${count}`;
});

// Display notification for username changes
socket.on('username-updated', (data) => {
    addMessageToChat(`User updated their name to: ${data.username}`, 'message-feedback');
});

// Function to add messages to the chat container
function addMessageToChat(message, className) {
    const messageElement = document.createElement('li');
    messageElement.classList.add(className);
    messageElement.innerHTML = `<p class="message">${message}</p>`;
    messageContainer.appendChild(messageElement);

    // Auto-scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
