import { ZONE_CONTENT } from './app_config.js';
import { toggleMute, playSFX } from './audio.js';

let isModalOpen = false;

export function setupUI() {
    const closeBtn = document.getElementById('modal-close');
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal();
    });

    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
        const muted = toggleMute();
        muteBtn.innerText = muted ? "🔇" : "🔊";
        muteBtn.classList.toggle('is-error', muted);
        muteBtn.classList.toggle('is-success', !muted);
    });
}

export function showNotification() {
    if (isModalOpen) return;
    playSFX('interact'); // Optional: Sound when prompt appears? Maybe too annoying.
    // Let's keep it silent or use a very soft sound.
    // For now, omitting SFX here, but demonstrating how it could be used.
    const el = document.getElementById('notification');
    el.style.display = 'block';
}

export function hideNotification() {
    const el = document.getElementById('notification');
    el.style.display = 'none';
}

export function showModal(zoneKey) {
    if (!ZONE_CONTENT[zoneKey]) return;
    
    const data = ZONE_CONTENT[zoneKey];
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');

    title.innerText = data.title;
    content.innerHTML = data.content;

    overlay.style.display = 'flex';
    isModalOpen = true;
    hideNotification();
    playSFX('interact');
}

export function hideModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'none';
    isModalOpen = false;
}

export function getIsModalOpen() {
    return isModalOpen;
}
