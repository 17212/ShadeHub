import { db, auth } from './firebase.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileAvatar = document.getElementById('profile-avatar');
const userPostsContainer = document.getElementById('user-posts-container');
const statValues = document.querySelectorAll('.stat-value'); // 0: Posts, 1: Followers, 2: Following

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Update Header
        profileName.textContent = user.displayName || "Anonymous User";
        profileEmail.textContent = user.email || "No email linked";
        profileAvatar.textContent = (user.displayName || "A")[0].toUpperCase();

        // Load User Posts
        await loadUserPosts(user.uid);
    } else {
        profileName.textContent = "Anonymous";
        profileEmail.textContent = "No active session";
        profileAvatar.textContent = "?";
        userPostsContainer.innerHTML = '<div class="post-card"><div class="post-content" style="text-align: center; color: var(--text-secondary);">Please login to view profile data.</div></div>';
    }
});

async function loadUserPosts(uid) {
    if (!userPostsContainer) return;

    userPostsContainer.innerHTML = '<div class="loading-skeleton" style="padding: 20px; text-align: center; color: var(--text-secondary);">Loading History...</div>';

    try {
        const q = query(collection(db, "posts"), where("uid", "==", uid), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        // Update Post Count
        if (statValues[0]) statValues[0].textContent = querySnapshot.size;

        userPostsContainer.innerHTML = '';

        if (querySnapshot.empty) {
            userPostsContainer.innerHTML = '<div class="post-card"><div class="post-content" style="text-align: center; color: var(--text-secondary);">No transmission history found.</div></div>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postEl = createPostElement(doc.id, post);
            userPostsContainer.appendChild(postEl);
        });
    } catch (error) {
        console.error("Error loading user posts:", error);
        userPostsContainer.innerHTML = '<div class="post-card"><div class="post-content" style="text-align: center; color: var(--text-secondary);">Error loading data.</div></div>';
    }
}

function createPostElement(id, post) {
    const div = document.createElement('div');
    div.className = 'post-card';

    let time = 'Unknown';
    if (post.timestamp) {
        time = post.timestamp.toDate().toLocaleDateString();
    }

    const imageHtml = post.imageUrl ?
        `<div class="post-image" style="margin-top: 16px; border-radius: 12px; overflow: hidden;">
            <img src="${escapeHtml(post.imageUrl)}" alt="Post Image" style="width: 100%; height: auto; display: block;">
         </div>` : '';

    div.innerHTML = `
        <div class="post-header">
            <div class="user-avatar">${(post.author || "A")[0].toUpperCase()}</div>
            <div class="post-info">
                <h3>${escapeHtml(post.title)}</h3>
                <span>${time}</span>
            </div>
        </div>
        <div class="post-content">
            ${escapeHtml(post.body)}
            ${imageHtml}
        </div>
        <div class="post-actions">
            <button class="action-btn">
                <span>♥</span> ${post.likes ? post.likes.length : 0}
            </button>
        </div>
    `;
    return div;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
