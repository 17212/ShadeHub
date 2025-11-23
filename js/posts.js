import { db, auth } from './firebase.js';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { showToast, formatTimestamp } from './ui.js';

const postsCollection = collection(db, 'posts');

export async function createPost(title, body, tags) {
    if (!auth.currentUser) {
        showToast('AUTH_REQUIRED', 'error');
        return;
    }

    try {
        await addDoc(postsCollection, {
            title,
            body,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName || 'ANONYMOUS',
            timestamp: serverTimestamp(),
            votes: 0,
            commentsCount: 0
        });
        showToast('DATA_UPLOADED_SUCCESSFULLY');
        document.getElementById('create-post-modal').classList.add('hidden');
        document.getElementById('post-form').reset();
        <div class="post-preview">${post.body.substring(0, 150)}${post.body.length > 150 ? '...' : ''}</div>
        <div class="post-actions">
            <button class="action-btn">▲ ${post.votes}</button>
            <button class="action-btn">💬 ${post.commentsCount} COMMENTS</button>
            <button class="action-btn">⚡ SHARE</button>
        </div>
        `;
    return div;
}

// Bind Create Post Form
document.getElementById('post-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const tags = document.getElementById('post-tags').value;
    createPost(title, body, tags);
});
