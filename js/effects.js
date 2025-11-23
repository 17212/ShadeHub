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
        initPageTransition();

        // 10. 3D Tilt Effect for Cards
        function initTiltEffect() {
            document.addEventListener('mousemove', (e) => {
                document.querySelectorAll('.post-card, .panel').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
                        const rotateY = ((x - centerX) / centerX) * 5;

                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                        card.style.borderColor = 'var(--neon-green)';
                    } else {
                        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                        card.style.borderColor = '';
                    }
                });
            });
        }

        // 11. Hacker Typing Effects (Sound + Visual)
        function initTypingEffects() {
            const inputs = document.querySelectorAll('input[type="text"], textarea, input[type="password"], input[type="email"]');

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    audioSys.playClick(); // Mechanical sound

                    // Random color glitch on border
                    input.style.borderColor = Math.random() > 0.5 ? 'var(--neon-green)' : 'var(--neon-pink)';
                    setTimeout(() => input.style.borderColor = '', 100);
                });
            });
        }

        // 12. Page Transition (Terminal Style)
        function initPageTransition() {
            // Intercept link clicks
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.href && link.href.startsWith(window.location.origin) && !link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetUrl = link.href;

                    const overlay = document.createElement('div');
                    overlay.className = 'page-transition-overlay';
                    overlay.innerHTML = `<div class="loader-text">> INITIATING_JUMP_SEQUENCE...</div>`;
                    document.body.appendChild(overlay);

                    // Play sound
                    audioSys.playGlitch();

                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 800);
                }
            });
        }

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
        initKonamiCode();
        initEncryptedComments();
        initSystemLogs();
        initNodeMap();

        // 13. Konami Code (God Mode)
        function initKonamiCode() {
            const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            let index = 0;

            document.addEventListener('keydown', (e) => {
                if (e.key === code[index]) {
                    index++;
                    if (index === code.length) {
                        activateGodMode();
                        index = 0;
                    }
                } else {
                    index = 0;
                }
            });
        }

        function activateGodMode() {
            audioSys.playGlitch();
            document.body.style.fontFamily = '"Comic Sans MS", cursive'; // The ultimate troll
            alert('// GOD_MODE_ACTIVATED: UNLIMITED_POWER (Just kidding, nice font though)');
            setTimeout(() => {
                document.body.style.fontFamily = '';
                showToast('GOD_MODE_DEACTIVATED');
            }, 5000);
        }

        // 14. Encrypted Comments (Decrypt on Hover)
        function initEncryptedComments() {
            // Observer to handle dynamically loaded comments
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('comment-card')) {
                            encryptNode(node.querySelector('p') || node); // Assuming p tag or direct text
                        }
                    });
                });
            });

            const container = document.getElementById('comments-container');
            if (container) {
                observer.observe(container, { childList: true, subtree: true });
            }
        }

        function encryptNode(element) {
            const originalText = element.innerText;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

            element.dataset.original = originalText;
            element.innerText = originalText.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
            element.classList.add('encrypted-text');

            element.addEventListener('mouseenter', () => {
                revealText(element, originalText);
                audioSys.playHover();
            });
        }

        function revealText(element, text) {
            let iterations = 0;
            const interval = setInterval(() => {
                element.innerText = element.innerText.split('').map((char, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'[Math.floor(Math.random() * 43)];
                }).join('');

                if (iterations >= text.length) {
                    clearInterval(interval);
                }
                iterations += 1 / 3; // Speed of decryption
            }, 30);
        }

        // 15. Live System Logs
        function initSystemLogs() {
            const logContainer = document.createElement('div');
            logContainer.className = 'system-logs';
            document.body.appendChild(logContainer);

            const messages = [
                'Packet intercepted from 192.168.x.x',
                'Encryption key rotated',
                'New node joined the swarm',
                'Brute force attempt blocked',
                'Data stream synchronized',
                'Ping: 14ms',
                'Firewall integrity: 98%'
            ];

            setInterval(() => {
                const msg = messages[Math.floor(Math.random() * messages.length)];
                const line = document.createElement('div');
                line.className = 'log-line';
                line.innerText = `> [${new Date().toLocaleTimeString()}] ${msg}`;
                logContainer.prepend(line);

                if (logContainer.children.length > 5) {
                    logContainer.lastChild.remove();
                }
            }, 2000);
        }

        // 16. Active Node Map (Visual)
        function initNodeMap() {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) return;

            const panel = document.createElement('div');
            panel.className = 'panel';
            panel.innerHTML = `<h3>// ACTIVE_NODES</h3><canvas id="node-map" width="240" height="150"></canvas>`;
            sidebar.appendChild(panel);

            const canvas = document.getElementById('node-map');
            const ctx = canvas.getContext('2d');
            const nodes = [];

            for (let i = 0; i < 20; i++) {
                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2
                });
            }

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00ff41';
                nodes.forEach(node => {
                    node.x += node.vx;
                    node.y += node.vy;

                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Draw connections
                ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
                ctx.beginPath();
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dx = nodes[i].x - nodes[j].x;
                        const dy = nodes[i].y - nodes[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 50) {
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                        }
                    }
                }
                ctx.stroke();
                requestAnimationFrame(draw);
            }
            draw();
        }
