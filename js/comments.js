import { db, auth } from './firebase.js';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    increment,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { showToast, formatTimestamp } from './ui.js';

const commentsCollection = collection(db, 'comments');

export async function addComment(postId, text, parentId = null) {
    if (!auth.currentUser) {
        showToast('AUTH_REQUIRED', 'error');
        return;
    }

    try {
        await addDoc(commentsCollection, {
            postId,
            parentId,
            text,
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName || 'ANONYMOUS',
            timestamp: serverTimestamp(),
            votes: 0
        });

        // Update comment count on post
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            commentsCount: increment(1)
        });

        showToast('COMMENT_TRANSMITTED');
    } catch (error) {
        console.error(error);
        showToast('TRANSMISSION_FAILED', 'error');
    }
}

export function initCommentsListener(postId) {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;

    const q = query(
        commentsCollection,
        where('postId', '==', postId),
        orderBy('timestamp', 'desc')
    );

    onSnapshot(q, (snapshot) => {
        commentsContainer.innerHTML = '';
        const comments = [];
        snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));

        // Simple nesting logic (can be improved for deep nesting)
        const rootComments = comments.filter(c => !c.parentId);

        if (rootComments.length === 0) {
            commentsContainer.innerHTML = '<div class="no-comments">// NO_DATA_PACKETS_FOUND</div>';
            return;
        }

        rootComments.forEach(comment => {
            const el = createCommentElement(comment);
            commentsContainer.appendChild(el);

            // Find replies
            const replies = comments.filter(c => c.parentId === comment.id);
            replies.forEach(reply => {
                const replyEl = createCommentElement(reply, true);
                el.appendChild(replyEl);
            });
        });
    });
}

function createCommentElement(comment, isReply = false) {
    const div = document.createElement('div');
    div.className = `comment-card ${isReply ? 'reply' : ''}`;
    div.innerHTML = `
        <div class="comment-meta">
            <span class="user-tag">[${comment.authorName}]</span>
            <span class="time-tag">${formatTimestamp(comment.timestamp)}</span>
        </div>
        <div class="comment-body">${comment.text}</div>
        <div class="comment-actions">
            <button class="action-btn">▲ ${comment.votes}</button>
            <button class="action-btn reply-btn" data-id="${comment.id}">REPLY</button>
        </div>
    `;

    // Reply button handler
    div.querySelector('.reply-btn').addEventListener('click', () => {
        const replyInput = prompt('// ENTER_REPLY_DATA:');
        if (replyInput) {
            addComment(comment.postId, replyInput, comment.id);
        }
    });

    return div;
}
