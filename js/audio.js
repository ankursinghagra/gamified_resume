let isMuted = false;
let bgm = null;
let sfx = {};

export function initAudio() {
    // Background Music
    // Using a placeholder online URL or local path if available
    // For now, we'll try to use a local path, but if it fails, we handle it gracefully.
    bgm = new Audio('assets/audio/bgm.mp3'); 
    bgm.loop = true;
    bgm.volume = 0.3;

    // SFX
    sfx.interact = new Audio('assets/audio/interact.mp3');
    sfx.interact.volume = 0.5;

    // Try to play BGM (might be blocked by browser policy initially)
    // We attach a one-time click listener to body to ensure it starts
    const startAudio = () => {
        if (!isMuted && bgm.paused) {
            bgm.play().catch(e => console.log("Audio autoplay blocked:", e));
        }
        document.body.removeEventListener('click', startAudio);
        document.body.removeEventListener('keydown', startAudio);
    };

    document.body.addEventListener('click', startAudio);
    document.body.addEventListener('keydown', startAudio);
}

export function playSFX(name) {
    if (isMuted) return;
    if (sfx[name]) {
        sfx[name].currentTime = 0;
        sfx[name].play().catch(() => {});
    }
}

export function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        if (bgm) bgm.pause();
    } else {
        if (bgm) bgm.play().catch(() => {});
    }
    return isMuted;
}

export function getIsMuted() {
    return isMuted;
}
