console.log("App.js loading...");
import { auth } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { openModal, closeModal } from './effects.js';
import { initNotifications } from './notifications.js';
import { initPersonalization } from './personalization.js';

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn'); // If we add one
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const googleLoginBtn = document.getElementById('google-login');
const anonLoginBtn = document.getElementById('anon-login');
const profileLink = document.getElementById('profile-link');

// Auth State Listener
// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        updateAuthUI(true);
    } else {
        console.log("User logged out");
        updateAuthUI(false);
    }
});

function updateAuthUI(isLoggedIn) {
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = "Logout";
            loginBtn.href = "#";
        } else {
            loginBtn.textContent = "Login";
            loginBtn.href = "#";
        }
    }
    if (profileLink) {
        profileLink.style.display = isLoggedIn ? 'block' : 'block'; // Always show, redirect if needed
    }
}

// Event Listeners
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginBtn.textContent === "Logout") {
            handleLogout();
        } else {
            openModal('auth-modal');
        }
    });
}

// Login Handlers
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            closeModal(authModal);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Authentication failed: " + error.message);
        }
    });
}

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            closeModal(authModal);
        } catch (error) {
            console.error("Google login failed:", error);
            alert("Google Auth failed.");
        }
    });
}

if (anonLoginBtn) {
    anonLoginBtn.addEventListener('click', async () => {
        try {
            await signInAnonymously(auth);
            closeModal(authModal);
        } catch (error) {
            console.error("Anon login failed:", error);
            alert("Anonymous mode failed.");
        }
    });
}

async function handleLogout() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
    console.log("ShadeHub System Initialized");
    initNotifications();
    initPersonalization();
});
