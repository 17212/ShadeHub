import { audioSys } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    initInteractions();
    initTiltEffect();
});

// 1. Interactions
function initInteractions() {
    // Hover Effects for Buttons
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            // audioSys.playHover(); // Optional: Keep if sound is subtle
        });
    });

    // Modal Animations
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// 2. 3D Tilt Effect for Cards (Apple tvOS style)
function initTiltEffect() {
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.post-card, .glass-panel').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Subtle rotation
                const rotateX = ((y - centerY) / centerY) * -2; // Max 2deg
                const rotateY = ((x - centerX) / centerX) * 2;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                // card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                // card.style.borderColor = '';
            }
        });
    });
}

// Helper to open modal with animation
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        // Small delay to allow display:flex to apply before opacity transition
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }
}

// Helper to close modal
export function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Match CSS transition duration
}

// Close buttons
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    });
});
