import { openModal, closeModal } from './effects.js';

export function initPersonalization() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const colorBtns = document.querySelectorAll('.color-btn');
    const zenToggle = document.getElementById('zen-mode-toggle');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            requestAnimationFrame(() => settingsModal.classList.add('active'));
        });
    }

    // Color Picker
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            document.documentElement.style.setProperty('--accent-primary', color);
            document.documentElement.style.setProperty('--accent-glow', `${color}66`); // 40% opacity

            // Save preference
            localStorage.setItem('shadehub_accent', color);

            // Update active state
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Load saved color
    const savedColor = localStorage.getItem('shadehub_accent');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-primary', savedColor);
        document.documentElement.style.setProperty('--accent-glow', `${savedColor}66`);
        const activeBtn = document.querySelector(`.color-btn[data-color="${savedColor}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // Zen Mode
    if (zenToggle) {
        zenToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('zen-mode', e.target.checked);
        });
    }
}
