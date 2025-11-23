import { auth, db, googleProvider } from './firebase.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { showToast } from './ui.js';

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById('login-btn');
    const profileLink = document.getElementById('profile-link');
    const createPostBtn = document.getElementById('create-post-btn');

    if (user) {
        console.log('// USER_DETECTED:', user.uid);
        if (loginBtn) {
            loginBtn.innerText = '[LOGOUT]';
            loginBtn.onclick = handleLogout;
        }
        if (profileLink) profileLink.style.display = 'inline-block';
        if (createPostBtn) createPostBtn.style.display = 'inline-block';

        // Create user document if it doesn't exist
        await createUserDocument(user);
    } else {
        console.log('// USER_DISCONNECTED');
        if (loginBtn) {
            loginBtn.innerText = '[LOGIN]';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('auth-modal').classList.remove('hidden');
            };
        }
        if (profileLink) profileLink.style.display = 'none';
        // Keep create post visible but trigger auth modal on click (handled in app.js)
    }
});

async function createUserDocument(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email || 'ANONYMOUS',
                username: user.displayName || `USER_${user.uid.slice(0, 5)}`,
                avatar: user.photoURL || 'assets/default-avatar.png',
                karma: 0,
                createdAt: serverTimestamp(),
                isAnonymous: user.isAnonymous
            });
            console.log('// USER_RECORD_CREATED');
        } catch (error) {
            console.error('Error creating user doc:', error);
        }
    }
}

// Login Functions
export async function loginEmailPassword(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('ACCESS_GRANTED');
        document.getElementById('auth-modal').classList.add('hidden');
    } catch (error) {
        showToast(`ACCESS_DENIED: ${error.message}`, 'error');
    }
}

export async function registerEmailPassword(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast('NEW_IDENTITY_CREATED');
        document.getElementById('auth-modal').classList.add('hidden');
    } catch (error) {
        showToast(`REGISTRATION_FAILED: ${error.message}`, 'error');
    }
}

export async function loginAnonymous() {
    try {
        await signInAnonymously(auth);
        showToast('GHOST_MODE_ACTIVATED');
        document.getElementById('auth-modal').classList.add('hidden');
    } catch (error) {
        showToast(`CONNECTION_FAILED: ${error.message}`, 'error');
    }
}

export async function loginGoogle() {
    try {
        await signInWithPopup(auth, googleProvider);
        showToast('OAUTH_HANDSHAKE_COMPLETE');
        document.getElementById('auth-modal').classList.add('hidden');
    } catch (error) {
        showToast(`OAUTH_ERROR: ${error.message}`, 'error');
    }
}

export async function handleLogout() {
    try {
        await signOut(auth);
        showToast('LINK_TERMINATED');
        window.location.reload();
    } catch (error) {
        showToast(`LOGOUT_ERROR: ${error.message}`, 'error');
    }
}

// Bind events
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    // Simple check to distinguish login vs register (in a real app, use tabs)
    // For now, we'll try login, if fails with user-not-found, we try register? 
    // Or better, just assume login for now.
    loginEmailPassword(inputs[0].value, inputs[1].value);
});

document.getElementById('anon-login')?.addEventListener('click', loginAnonymous);
document.getElementById('google-login')?.addEventListener('click', loginGoogle);
