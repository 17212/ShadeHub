import { db, auth } from './firebase.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

let currentUser = null;

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (!user) {
        // Optional: Redirect or show login prompt in chat
        appendMessage({
            text: "You must be logged in to send messages.",
            user: "System",
            timestamp: new Date()
        }, 'received');
        if (messageInput) messageInput.disabled = true;
    } else {
        if (messageInput) messageInput.disabled = false;
    }
});

// Load Messages
const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(50));
onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
    });
    renderMessages(messages.reverse());
});

function renderMessages(messages) {
    chatMessages.innerHTML = '';

    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="message received">
                Welcome to the Dark Room. Messages here are ephemeral.
                <div class="message-meta">System • Now</div>
            </div>
        `;
        return;
    }

    messages.forEach(msg => {
        const isOwn = currentUser && msg.uid === currentUser.uid;
        appendMessage(msg, isOwn ? 'sent' : 'received');
    });
    scrollToBottom();
}

function appendMessage(msg, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;

    // Format time
    let time = '';
    if (msg.timestamp) {
        const date = msg.timestamp.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
        time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    div.innerHTML = `
        ${escapeHtml(msg.text)}
        <div class="message-meta">${escapeHtml(msg.user || 'Anonymous')} • ${time}</div>
    `;
    chatMessages.appendChild(div);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();

        if (!text || !currentUser) return;

        try {
            await addDoc(collection(db, "messages"), {
                text: text,
                uid: currentUser.uid,
                user: currentUser.displayName || currentUser.email.split('@')[0],
                timestamp: serverTimestamp()
            });
            messageInput.value = '';
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to transmit message.");
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
