console.log("Posts.js loading...");
import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const feedContainer = document.getElementById('feed-container');
const createPostBtn = document.getElementById('create-post-btn');
const createPostModal = document.getElementById('create-post-modal');
const postForm = document.getElementById('post-form');
const searchInput = document.getElementById('search-input');
const filterLinks = document.querySelectorAll('.menu-item[data-filter]');

let currentFilter = 'all';
let searchQuery = '';

// Auth State
let currentUser = null;
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// Open/Close Modal
if (createPostBtn) {
    createPostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Authentication required to transmit data.");
            return;
        }
        openModal('create-post-modal');
    });
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('active'));
    }
}

// Create Post
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const body = document.getElementById('post-body').value;
        const tags = document.getElementById('post-tags').value;
        const imageUrl = document.getElementById('post-image').value;

        try {
            await addDoc(collection(db, "posts"), {
                title: title,
                body: body,
                imageUrl: imageUrl || null,
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                uid: currentUser.uid,
                author: currentUser.displayName || "Anonymous",
                timestamp: serverTimestamp(),
                likes: []
            });

            // Close modal and reset form
            const modal = document.getElementById('create-post-modal');
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
            postForm.reset();

            loadPosts(); // Reload feed
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Transmission failed.");
        }
    });
}

// Search & Filter Listeners
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        loadPosts();
    });
}

filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentFilter = link.dataset.filter;
        loadPosts();
    });
});

// Load Posts
export async function loadPosts() {
    if (!feedContainer) return;

    feedContainer.innerHTML = '<div class="loading-skeleton" style="padding: 20px; text-align: center; color: var(--text-secondary);">Loading Data Stream...</div>';

    let q;
    const postsRef = collection(db, "posts");

    if (currentFilter === 'mine' && currentUser) {
        q = query(postsRef, where("uid", "==", currentUser.uid), orderBy("timestamp", "desc"));
    } else if (currentFilter === 'popular') {
        // Client-side sort for popular since we don't have a 'likesCount' field indexed perfectly yet
        q = query(postsRef, orderBy("timestamp", "desc"));
    } else {
        q = query(postsRef, orderBy("timestamp", "desc"));
    }

    const querySnapshot = await getDocs(q);

    feedContainer.innerHTML = '';

    let posts = [];
    querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
    });

    // Client-side Filtering & Sorting
    if (currentFilter === 'popular') {
        posts.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));
    }

    if (searchQuery) {
        posts = posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery) ||
            post.body.toLowerCase().includes(searchQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
    }

    if (posts.length === 0) {
        feedContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No transmissions found.</div>';
        return;
    }

    posts.forEach(post => {
        const postEl = createPostElement(post.id, post);
        feedContainer.appendChild(postEl);
    });
}

function createPostElement(id, post) {
    const div = document.createElement('div');
    div.className = 'post-card';

    const isLiked = post.likes && currentUser && post.likes.includes(currentUser.uid);
    const likeCount = post.likes ? post.likes.length : 0;

    // Format time
    let time = 'Unknown';
    if (post.timestamp) {
        time = post.timestamp.toDate().toLocaleDateString() + ' ' + post.timestamp.toDate().toLocaleTimeString();
    }

    // Image HTML
    const imageHtml = post.imageUrl ?
        `<div class="post-image" style="margin-top: 16px; border-radius: 12px; overflow: hidden;">
            <img src="${escapeHtml(post.imageUrl)}" alt="Post Image" style="width: 100%; height: auto; display: block;">
         </div>` : '';

    div.innerHTML = `
        <div class="post-header">
            <div class="user-avatar">${post.author[0].toUpperCase()}</div>
            <div class="post-info">
                <h3>${escapeHtml(post.title)}</h3>
                <span>${escapeHtml(post.author)} • ${time}</span>
            </div>
        </div>
        <div class="post-content">
            ${escapeHtml(post.body)}
            ${imageHtml}
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn ${isLiked ? 'active' : ''}" data-id="${id}">
                <span>${isLiked ? '♥' : '♡'}</span> ${likeCount}
            </button>
            <button class="action-btn">
                <span>💬</span> Comment
            </button>
        </div>
    `;

    // Like Handler
    const likeBtn = div.querySelector('.like-btn');
    likeBtn.addEventListener('click', async () => {
        if (!currentUser) {
            alert("Auth required.");
            return;
        }

        const postRef = doc(db, "posts", id);
        if (isLiked) {
            await updateDoc(postRef, {
                likes: arrayRemove(currentUser.uid)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(currentUser.uid)
            });
        }
        loadPosts(); // Refresh to show update
    });

    return div;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadPosts);
