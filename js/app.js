import { auth, db } from './firebase.js';

// Event Listeners for Modals
setupModals();
});

function initMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('matrix-bg');

    if (!container) return;

    container.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 33);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function setupModals() {
    const loginBtn = document.getElementById('login-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    const authModal = document.getElementById('auth-modal');
    const createPostModal = document.getElementById('create-post-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.remove('hidden');
        });
    }

    if (createPostBtn) {
        createPostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check auth state here later
            createPostModal.classList.remove('hidden');
        });
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.add('hidden');
            createPostModal.classList.add('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.add('hidden');
        if (e.target === createPostModal) createPostModal.classList.add('hidden');
    });
}
