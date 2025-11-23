import { audioSys } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initSplashScreen();
    initSelfDestruct();
    initInteractions();
    initCrazyFeatures();

    // Add CCTV Overlay
    const cctv = document.createElement('div');
    cctv.className = 'cctv-overlay';
    document.body.appendChild(cctv);
});

// 1. Custom Cursor
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Binary Trail
        if (Math.random() > 0.8) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.innerText = Math.random() > 0.5 ? '1' : '0';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1000);
        }
    });

    // Hover Effects
    document.querySelectorAll('a, button, input').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            audioSys.playHover();
        });
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Click Sound
    document.addEventListener('click', () => {
        audioSys.playClick();
        audioSys.enable(); // Enable audio context on first click
    });
}

// 2. Splash Screen
function initSplashScreen() {
    if (sessionStorage.getItem('access_granted')) return;

    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    document.body.appendChild(splash);

    const lines = [
        'INITIALIZING CONNECTION...',
        'BYPASSING FIREWALLS...',
        'ENCRYPTING DATA STREAMS...',
        'ACCESS GRANTED.'
    ];

    let delay = 0;
    lines.forEach((line, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = 'terminal-text';
            p.innerText = `> ${line}`;
            splash.appendChild(p);
            audioSys.playClick();
        }, delay);
        delay += 800;
    });

    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
        sessionStorage.setItem('access_granted', 'true');
        audioSys.playGlitch();
    }, delay + 500);
}

// 3. Self Destruct Timer
function initSelfDestruct() {
    const timer = document.createElement('div');
    timer.id = 'self-destruct';
    document.body.appendChild(timer);

    let time = 3600; // 1 hour

    setInterval(() => {
        time--;
        const min = Math.floor(time / 60).toString().padStart(2, '0');
        const sec = (time % 60).toString().padStart(2, '0');
        timer.innerText = `AUTO_PURGE: ${min}:${sec}`;

        if (time <= 0) time = 3600; // Reset loop
    }, 1000);
}

// 4. Interactions
function initInteractions() {
    // Magnetic Buttons
    document.querySelectorAll('.cyber-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Screen Shake on Actions
    document.addEventListener('action-trigger', () => {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);
    });

    // Paranoia Mode (Press 'P' 3 times)
    let pCount = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p') {
            pCount++;
            if (pCount === 3) {
                window.location.href = 'https://www.google.com';
            }
        } else {
            pCount = 0;
        }
    });
}

// 5. Crazy Features
function initCrazyFeatures() {
    // Tab Title Scroller
    const titles = [
        'ShadeHub',
        'Don\'t Look Back',
        'They Are Watching',
        'Encrypting...',
        'ShadeHub'
    ];
    let titleIdx = 0;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const interval = setInterval(() => {
                document.title = titles[titleIdx];
                titleIdx = (titleIdx + 1) % titles.length;
                if (!document.hidden) {
                    clearInterval(interval);
                    document.title = 'ShadeHub | The Underground Network';
                }
            }, 1000);
        }
    });

    // Redacted Text Logic
    // Find random text nodes and wrap words in .redacted
    // (Simplified for now: just add class to some elements manually or randomly)
}

// 7. Zen Mode (Toggle with 'Z' key)
function initZenMode() {
    let zenEnabled = false;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'z' && e.altKey) { // Alt+Z to avoid accidental triggers
            zenEnabled = !zenEnabled;
            document.body.classList.toggle('zen-mode', zenEnabled);
            audioSys.playClick();
            showToast(zenEnabled ? 'ZEN_MODE_ENABLED' : 'ZEN_MODE_DISABLED');
        }
    });
}

// 8. Scroll Progress Indicator
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    });
}

// 9. Command Palette (Ctrl+K)
function initCommandPalette() {
    const palette = document.createElement('div');
    palette.className = 'command-palette hidden';
    palette.innerHTML = `
        <div class="cmd-content">
            <input type="text" id="cmd-input" placeholder="> ENTER_COMMAND...">
            <ul id="cmd-list">
                <li data-action="home">> GO_TO_FEED</li>
                <li data-action="profile">> OPEN_PROFILE</li>
                <li data-action="new_post">> UPLOAD_DATA</li>
                <li data-action="zen">> TOGGLE_ZEN_MODE</li>
                <li data-action="tor">> CONNECT_TOR</li>
            </ul>
        </div>
    `;
    document.body.appendChild(palette);

    const input = palette.querySelector('#cmd-input');
    const list = palette.querySelector('#cmd-list');

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
            e.preventDefault();
            palette.classList.remove('hidden');
            input.focus();
        }
        if (e.key === 'Escape') {
            palette.classList.add('hidden');
        }
    });

    // Filter commands
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        Array.from(list.children).forEach(li => {
            const text = li.innerText.toLowerCase();
            li.style.display = text.includes(term) ? 'block' : 'none';
        });
    });

    // Execute commands
    list.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;

        palette.classList.add('hidden');
        audioSys.playClick();

        switch (action) {
            case 'home': window.location.href = 'index.html'; break;
            case 'profile': window.location.href = 'profile.html'; break;
            case 'new_post': document.getElementById('create-post-btn').click(); break;
            case 'zen': document.body.classList.toggle('zen-mode'); break;
            case 'tor': simulateTorConnection(); break;
        }
    });
}

function showToast(msg) {
    // Simple toast reuse or create new
    const toast = document.createElement('div');
    toast.className = 'sys-toast';
    toast.innerText = `> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

initZenMode();
initScrollProgress();
initCommandPalette();

// 6. Tor Gate Simulation (Triggered by 'T' key 3 times)
function initTorGate() {
    let tCount = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't') {
            tCount++;
            if (tCount === 3) {
                simulateTorConnection();
                tCount = 0;
            }
        } else {
            tCount = 0;
        }
    });
}

function simulateTorConnection() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; z-index: 30000; display: flex;
        justify-content: center; align-items: center; flex-direction: column;
        font-family: monospace; color: #fff;
    `;
    document.body.appendChild(overlay);

    const steps = [
        'Establishing encrypted circuit...',
        'Handshaking with relay node 1 (France)...',
        'Handshaking with relay node 2 (Russia)...',
        'Handshaking with exit node (Unknown)...',
        'Circuit established.',
        'Welcome to the Onion Router.'
    ];

    let delay = 0;
    steps.forEach(step => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.innerText = `> ${step}`;
            p.style.color = '#0f0';
            overlay.appendChild(p);
        }, delay);
        delay += 1000 + Math.random() * 1000;
    });

    setTimeout(() => {
        overlay.remove();
        alert('// TOR_MODE_ACTIVE: Your IP is now hidden.');
    }, delay + 1000);
}

initTorGate();
