import { db, auth } from './firebase.js';
import { collection, query, where, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initNotifications() {
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.querySelector('.notif-badge');
    const notifList = document.getElementById('notif-list');
    const clearBtn = document.getElementById('clear-notifs');

    if (!notifBtn || !notifDropdown) return;

    // Toggle Dropdown
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
        if (!notifDropdown.classList.contains('hidden')) {
            // Mark all as read visually (logic to update DB would go here)
            notifBadge.classList.add('hidden');
        }
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
            notifDropdown.classList.add('hidden');
        }
    });

    // Clear Notifications
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifList.innerHTML = '<div class="empty-state">No new alerts</div>';
            notifBadge.classList.add('hidden');
        });
    }

    // Mock Notifications (since we don't have a real backend trigger yet)
    // In a real app, this would listen to a 'notifications' subcollection
    setTimeout(() => {
        addNotification({
            text: "Welcome to ShadeHub v2.0. System is stable.",
            time: "Just now",
            type: "system"
        });
    }, 2000);
}

function addNotification(notif) {
    const notifList = document.getElementById('notif-list');
    const notifBadge = document.querySelector('.notif-badge');

    if (!notifList) return;

    // Remove empty state if present
    const emptyState = notifList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const div = document.createElement('div');
    div.className = 'notif-item unread';
    div.innerHTML = `
        <div class="notif-icon">
            ${getIcon(notif.type)}
        </div>
        <div class="notif-content">
            <div class="notif-text">${notif.text}</div>
            <div class="notif-time">${notif.time}</div>
        </div>
    `;

    notifList.prepend(div);

    // Show badge
    if (notifBadge) notifBadge.classList.remove('hidden');
}

function getIcon(type) {
    if (type === 'system') return '⚡';
    if (type === 'like') return '♥';
    if (type === 'comment') return '💬';
    return '•';
}
