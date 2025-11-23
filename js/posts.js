import { db, auth } from './firebase.js';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    where,
    doc,
    updateDoc,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { showToast, createPostElement } from './ui.js';

const postsCollection = collection(db, 'posts');

// --- Create Post ---
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
            voteCount: 0,
            commentCount: 0
        });
        showToast('DATA_UPLOADED_SUCCESSFULLY');
        document.getElementById('create-post-modal').classList.add('hidden');
        document.getElementById('post-form').reset();

        // Reload posts to show the new one
        loadPosts();
    } catch (error) {
        console.error(error);
        showToast('UPLOAD_FAILED', 'error');
    }
}

// --- Load Posts (with Filters) ---
export async function loadPosts(filter = 'all') {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    feedContainer.innerHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line body"></div>
        </div>
    `;

    try {
        let q;

        if (filter === 'popular') {
            q = query(postsCollection, orderBy("voteCount", "desc"), limit(20));
        } else if (filter === 'mine') {
            const user = auth.currentUser;
            if (!user) {
                feedContainer.innerHTML = '<p class="error-msg">> ERROR: AUTH_REQUIRED_FOR_LOGS</p>';
                return;
            }
            q = query(postsCollection, where("authorId", "==", user.uid), orderBy("timestamp", "desc"));
        } else {
            // Default: Newest
            q = query(postsCollection, orderBy("timestamp", "desc"), limit(20));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            feedContainer.innerHTML = '<p class="no-data">> NO_DATA_FOUND_IN_SECTOR</p>';
            return;
        }

        feedContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = { id: doc.id, ...doc.data() };
            const postElement = createPostElement(post);
            feedContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error("Error loading posts:", error);
        feedContainer.innerHTML = '<p class="error-msg">> ERROR: DATA_CORRUPTION_DETECTED</p>';
    }
}

// --- Vote System ---
export async function votePost(postId, type) {
    const user = auth.currentUser;
    if (!user) {
        showToast('AUTH_REQUIRED_TO_VOTE', 'error');
        return;
    }

    const postRef = doc(db, "posts", postId);
    const postElement = document.getElementById(`post-${postId}`);
    const scoreSpan = postElement?.querySelector('.vote-score');

    try {
        // Optimistic UI Update
        if (scoreSpan) {
            let currentScore = parseInt(scoreSpan.innerText) || 0;
            scoreSpan.innerText = type === 'up' ? currentScore + 1 : currentScore - 1;
        }

        // Update Firestore
        await updateDoc(postRef, {
            voteCount: increment(type === 'up' ? 1 : -1)
        });

    } catch (error) {
        console.error("Vote failed:", error);
        // Revert UI if failed (optional, keeping it simple)
    }
}

// Bind Create Post Form
document.getElementById('post-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const tags = document.getElementById('post-tags').value;
    createPost(title, body, tags);
});

// Expose functions globally if needed for inline onclicks (though module usage is better)
window.vote = (id, type) => votePost(id, type);
