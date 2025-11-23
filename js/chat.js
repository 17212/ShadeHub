import { db, auth } from './firebase.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg-input');
const messagesContainer = document.getElementById('chat-messages');

// Load Messages
const q = query(collection(db, "global_chat"), orderBy("timestamp", "desc"), limit(50));
onSnapshot(q, (snapshot) => {
    // Clear current messages (inefficient but simple for now, better to prepend)
    // Actually, snapshot returns all docs on first load, then changes.
    // For simplicity in this vanilla JS app, we'll just rebuild or append.
    // Let's rebuild to keep order correct easily.

    const messages = [];
    snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
    });
    messages.reverse(); // Show oldest first at top

    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        const isMine = auth.currentUser && msg.uid === auth.currentUser.uid;
        div.className = `message ${isMine ? 'mine' : ''}`;
        div.innerHTML = `
            <div class="msg-header">
                <span>${msg.user || 'ANONYMOUS'}</span>
                <span>${msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : 'PENDING'}</span>
            </div>
            <div class="msg-body">${escapeHtml(msg.text)}</div>
        `;
        messagesContainer.appendChild(div);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Send Message
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    const user = auth.currentUser;
    if (!user) {
        alert('// ERROR: AUTH_REQUIRED_TO_TRANSMIT');
        return;
    }

    try {
        await addDoc(collection(db, "global_chat"), {
            text: text,
            uid: user.uid,
            user: user.displayName || 'Unknown_Operative',
            timestamp: serverTimestamp()
        });
        msgInput.value = '';
    } catch (err) {
        console.error("Error sending message:", err);
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
