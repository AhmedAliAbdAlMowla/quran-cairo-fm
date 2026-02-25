// Language switching function
function switchLanguage(lang) {
    if (lang === 'ar') {
        window.location.href = '/';
    } else {
        window.location.href = '/en';
    }
}

// Elements
const statusText = document.getElementById('status');
const egyptAudio = document.getElementById('egyptAudio');
const statusIndicator = document.querySelector('.status-indicator');
const playerPanel = document.querySelector('.player-panel');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.querySelector('.volume-value');
const volumeFill = document.querySelector('.volume-fill');
const volumeIcon = document.querySelector('.volume-icon');
const currentTimeEl = document.getElementById('currentTime');
const currentSecondsEl = document.getElementById('currentSeconds');
const liveIndicator = document.querySelector('.live-indicator');
const counterLabel = document.getElementById('counterLabel');


// Audio controls
function playRadio() {
    const playPromise = egyptAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            updateStatus('playing');
            animatePlayButton();
        }).catch(error => {
            console.error('Playback error:', error);
            statusText.textContent = 'Press again to play';
            // Try to play again with user interaction
            setTimeout(() => {
                statusText.textContent = 'Ready to Play';
            }, 2000);
        });
    }
}

function stopRadio() {
    egyptAudio.pause();
    egyptAudio.currentTime = 0;
    updateStatus('stopped');
    animateStopButton();
}

function refreshPlayer() {
    updateStatus('refreshing');
    animateRefreshButton();
    egyptAudio.load();
    setTimeout(() => {
        const playPromise = egyptAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateStatus('playing');
            }).catch(error => {
                console.error('Refresh error:', error);
                statusText.textContent = 'Ready to Play';
            });
        }
    }, 1000);
}


// Status management
function updateStatus(state) {
    const states = {
        playing: { text: 'Now Playing', class: 'playing' },
        paused: { text: 'Paused', class: '' },
        stopped: { text: 'Stopped', class: '' },
        refreshing: { text: 'Refreshing...', class: '' },
        ready: { text: 'Ready to Play', class: '' }
    };

    const stateConfig = states[state] || states.ready;
    statusText.textContent = stateConfig.text;

    if (stateConfig.class) {
        statusIndicator.classList.add(stateConfig.class);
    } else {
        statusIndicator.classList.remove('playing');
    }

    // Control water animation based on state
    if (state === 'playing') {
        playerPanel.classList.add('playing');
    } else {
        playerPanel.classList.remove('playing');
    }
}

// Button animations
function animatePlayButton() {
    const btn = document.querySelector('.play-btn');
    btn.classList.add('playing');
    createRipple(btn);
}

function animateStopButton() {
    const playBtn = document.querySelector('.play-btn');
    playBtn.classList.remove('playing');
    const stopBtn = document.querySelector('.stop-btn');
    createRipple(stopBtn);
}

function animateRefreshButton() {
    const btn = document.querySelector('.refresh-btn');
    const svg = btn.querySelector('.btn-svg');
    svg.style.animation = 'rotate-icon 1s ease-in-out';
    setTimeout(() => {
        svg.style.animation = '';
    }, 1000);
    createRipple(btn);
}

function createRipple(button) {
    const ripple = button.querySelector('.btn-ripple');
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    setTimeout(() => {
        // Clear all inline styles to hide the ripple completely
        ripple.style = '';
    }, 600);
}


let loadingTimeout;

egyptAudio.addEventListener('loadstart', () => {
    statusText.textContent = 'Loading...';
    counterLabel.textContent = 'Loading...';

    // Clear any existing timeout
    clearTimeout(loadingTimeout);

    // Set a timeout to reset status if loading takes too long
    loadingTimeout = setTimeout(() => {
        if (egyptAudio.paused) {
            statusText.textContent = 'Ready to Play';
            counterLabel.textContent = 'Ready';
        }
    }, 3000);
});

egyptAudio.addEventListener('canplay', () => {
    clearTimeout(loadingTimeout);
    if (!egyptAudio.paused) {
        updateStatus('playing');
    } else {
        statusText.textContent = 'Ready to Play';
        counterLabel.textContent = 'Ready';
    }
});

egyptAudio.addEventListener('error', () => {
    statusText.textContent = 'Error loading stream';
    playerPanel.classList.remove('playing');
    counterLabel.textContent = 'Error';
    liveIndicator.classList.remove('active');
});

// Detect iOS devices
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Volume control with iOS compatibility
function updateVolume() {
    const value = volumeSlider.value;

    // Try to set volume (won't work on iOS but won't cause errors)
    try {
        if (!isIOS) {
            egyptAudio.volume = value / 100;
        }
    } catch (e) {
        console.log('Volume control not supported on this device');
    }

    // Visual feedback always works
    volumeValue.textContent = value + '%';

    // Update volume fill height (if exists)
    if (volumeFill) {
        volumeFill.style.height = value + '%';
    }

    // Update slider background gradient for visual feedback
    const percentage = value;
    volumeSlider.style.background = `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`;

    // Update volume icon based on level
    if (value == 0) {
        volumeIcon.textContent = '🔇';
    } else if (value < 30) {
        volumeIcon.textContent = '🔈';
    } else if (value < 70) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// Add multiple event listeners for better iOS support
volumeSlider.addEventListener('input', updateVolume);
volumeSlider.addEventListener('change', updateVolume);
volumeSlider.addEventListener('touchstart', function(e) {
    e.stopPropagation();
});
volumeSlider.addEventListener('touchmove', function(e) {
    e.stopPropagation();
    updateVolume();
});
volumeSlider.addEventListener('touchend', updateVolume);

// Initialize volume on page load
if (isIOS) {
    // On iOS, set slider to 100% since volume is always at max
    volumeSlider.value = 100;
    volumeValue.textContent = '100%';
    volumeIcon.textContent = '🔊';
    // Add iOS notice
    if (volumeValue) {
        volumeValue.title = 'Use device volume buttons';
    }
} else {
    egyptAudio.volume = 0.8;
    volumeSlider.value = 80;
    updateVolume();
}

// Counter functionality
let playbackTime = 0;
let counterInterval;

function startCounter() {
    playbackTime = 0;
    clearInterval(counterInterval);
    counterInterval = setInterval(() => {
        playbackTime++;
        updateCounter();
    }, 1000);
}

function stopCounter() {
    clearInterval(counterInterval);
    playbackTime = 0;
    updateCounter();
}

function updateCounter() {
    const mins = Math.floor(playbackTime / 60);
    const secs = playbackTime % 60;
    currentTimeEl.textContent = mins.toString().padStart(2, '0');
    currentSecondsEl.textContent = secs.toString().padStart(2, '0');
}

// Update audio event listeners for counter
egyptAudio.addEventListener('play', () => {
    updateStatus('playing');
    startCounter();
    liveIndicator.classList.add('active');
    counterLabel.textContent = 'Now Playing';
});

egyptAudio.addEventListener('pause', () => {
    updateStatus('paused');
    stopCounter();
    liveIndicator.classList.remove('active');
    counterLabel.textContent = 'Paused';
});

egyptAudio.addEventListener('ended', () => {
    updateStatus('stopped');
    stopCounter();
    liveIndicator.classList.remove('active');
    counterLabel.textContent = 'Stopped';
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!isIOS) {
        egyptAudio.volume = 0.8;
        if (volumeFill) {
            volumeFill.style.height = '80%';
        }
    }
    liveIndicator.classList.remove('active');
    counterLabel.textContent = 'Ready';

    // Add hover effects to panels
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        panel.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Ripple effect on click
    panels.forEach(panel => {
        panel.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
});

// CSS for animations (inject dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .click-ripple {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%) scale(0);
        animation: ripple-expand 1s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-expand {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Store original functions
const originalPlayRadio = playRadio;
const originalStopRadio = stopRadio;
const originalRefreshPlayer = refreshPlayer;

// Expose wrapped functions to global scope for button onclick handlers
window.playRadio = function() {
    if (!egyptAudio) {
        initializeElements();
    }
    originalPlayRadio();
};

window.stopRadio = function() {
    if (!egyptAudio) {
        initializeElements();
    }
    originalStopRadio();
};

window.refreshPlayer = function() {
    if (!egyptAudio) {
        initializeElements();
    }
    originalRefreshPlayer();
};

window.switchLanguage = switchLanguage;

// Initialize status on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStatus('ready');
});
