export function showToast(message, type = 'info') {
    @keyframes slideIn {
                from { transform: translateX(100 %); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
    }
    `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

export function formatTimestamp(timestamp) {
    if (!timestamp) return 'UNKNOWN_TIME';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return 'JUST_NOW';
    if (diff < 3600) return `${ Math.floor(diff / 60) }M AGO`;
    if (diff < 86400) return `${ Math.floor(diff / 3600) }H AGO`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).toUpperCase();
}
