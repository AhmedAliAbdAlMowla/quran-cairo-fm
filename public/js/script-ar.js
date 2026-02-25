// Language switching function
function switchLanguage(lang) {
    if (lang === 'ar') {
        window.location.href = '/';
    } else {
        window.location.href = '/en';
    }
}

// Elements - will be initialized when DOM is ready
let statusText, egyptAudio, statusIndicator, playerPanel, volumeSlider, volumeValue;
let volumeFill, volumeIcon, currentTimeEl, currentSecondsEl, liveIndicator, counterLabel;
let loadingTimeout, counterInterval;
let playbackTime = 0;

// Initialize elements when DOM is ready
function initializeElements() {
    statusText = document.getElementById('status');
    egyptAudio = document.getElementById('egyptAudio');
    statusIndicator = document.querySelector('.status-indicator');
    playerPanel = document.querySelector('.player-panel');
    volumeSlider = document.getElementById('volumeSlider');
    volumeValue = document.querySelector('.volume-value');
    volumeFill = document.querySelector('.volume-fill');
    volumeIcon = document.querySelector('.volume-icon');
    currentTimeEl = document.getElementById('currentTime');
    currentSecondsEl = document.getElementById('currentSeconds');
    liveIndicator = document.querySelector('.live-indicator');
    counterLabel = document.getElementById('counterLabel');
}

// Audio controls
function playRadio() {
    if (!egyptAudio) return;

    const playPromise = egyptAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            updateStatus('playing');
            animatePlayButton();
        }).catch(error => {
            console.error('خطأ في التشغيل:', error);
            statusText.textContent = 'اضغط مرة أخرى للتشغيل';
            // Try to play again with user interaction
            setTimeout(() => {
                statusText.textContent = 'جاهز للتشغيل';
            }, 2000);
        });
    }
}

function stopRadio() {
    if (!egyptAudio) return;

    egyptAudio.pause();
    egyptAudio.currentTime = 0;
    updateStatus('stopped');
    animateStopButton();
}

function refreshPlayer() {
    if (!egyptAudio) return;

    updateStatus('refreshing');
    animateRefreshButton();
    egyptAudio.load();
    setTimeout(() => {
        const playPromise = egyptAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateStatus('playing');
            }).catch(error => {
                console.error('خطأ في التحديث:', error);
                statusText.textContent = 'جاهز للتشغيل';
            });
        }
    }, 1000);
}

// Status management
function updateStatus(state) {
    if (!statusText || !statusIndicator) return;

    const states = {
        playing: { text: 'يتم التشغيل الآن', class: 'playing' },
        paused: { text: 'متوقف مؤقتاً', class: '' },
        stopped: { text: 'متوقف', class: '' },
        refreshing: { text: 'جاري التحديث...', class: '' },
        ready: { text: 'جاهز للتشغيل', class: '' }
    };

    const stateConfig = states[state] || states.ready;
    statusText.textContent = stateConfig.text;

    if (stateConfig.class) {
        statusIndicator.classList.add(stateConfig.class);
    } else {
        statusIndicator.classList.remove('playing');
    }

    // Control water animation based on state
    if (playerPanel) {
        if (state === 'playing') {
            playerPanel.classList.add('playing');
        } else {
            playerPanel.classList.remove('playing');
        }
    }
}

// Button animations
function animatePlayButton() {
    const btn = document.querySelector('.play-btn');
    if (btn) {
        btn.classList.add('playing');
        createRipple(btn);
    }
}

function animateStopButton() {
    const playBtn = document.querySelector('.play-btn');
    if (playBtn) {
        playBtn.classList.remove('playing');
    }
    const stopBtn = document.querySelector('.stop-btn');
    if (stopBtn) {
        createRipple(stopBtn);
    }
}

function animateRefreshButton() {
    const btn = document.querySelector('.refresh-btn');
    if (btn) {
        const svg = btn.querySelector('.btn-svg');
        if (svg) {
            svg.style.animation = 'rotate-icon 1s ease-in-out';
            setTimeout(() => {
                svg.style.animation = '';
            }, 1000);
        }
        createRipple(btn);
    }
}

// Create ripple effect
function createRipple(button) {
    const ripple = button.querySelector('.btn-ripple');
    if (!ripple) return;

    ripple.style.display = 'block';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    setTimeout(() => {
        ripple.style = '';
    }, 600);
}

// Detect iOS devices
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Volume control with iOS compatibility
function updateVolume() {
    if (!volumeSlider || !volumeValue || !egyptAudio) return;

    const value = volumeSlider.value;

    // Only set volume for non-iOS devices
    if (!isIOS && egyptAudio) {
        egyptAudio.volume = value / 100;
    }

    // Visual feedback always works
    volumeValue.textContent = value + '%';

    // Update volume fill height (if exists)
    if (volumeFill) {
        volumeFill.style.height = value + '%';
    }

    // Update slider background gradient for visual feedback
    const percentage = value;
    volumeSlider.style.background = `linear-gradient(to top, var(--primary-glow) 0%, var(--primary-glow) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`;

    // Update volume icon
    if (volumeIcon) {
        if (value == 0) {
            volumeIcon.textContent = '🔇';
        } else if (value < 33) {
            volumeIcon.textContent = '🔈';
        } else if (value < 66) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
}

// Counter functionality
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
    if (!currentTimeEl || !currentSecondsEl) return;

    const mins = Math.floor(playbackTime / 60);
    const secs = playbackTime % 60;
    currentTimeEl.textContent = mins.toString().padStart(2, '0');
    currentSecondsEl.textContent = secs.toString().padStart(2, '0');
}

// Set viewport height for mobile
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Setup all event listeners
function setupEventListeners() {
    if (!egyptAudio) return;

    // Audio event listeners
    egyptAudio.addEventListener('loadstart', () => {
        if (statusText) statusText.textContent = 'جاري التحميل...';
        if (counterLabel) counterLabel.textContent = 'جاري التحميل...';

        clearTimeout(loadingTimeout);
        loadingTimeout = setTimeout(() => {
            if (egyptAudio.paused) {
                if (statusText) statusText.textContent = 'جاهز للتشغيل';
                if (counterLabel) counterLabel.textContent = 'جاهز';
            }
        }, 3000);
    });

    egyptAudio.addEventListener('canplay', () => {
        clearTimeout(loadingTimeout);
        if (!egyptAudio.paused) {
            updateStatus('playing');
        } else {
            if (statusText) statusText.textContent = 'جاهز للتشغيل';
            if (counterLabel) counterLabel.textContent = 'جاهز';
        }
    });

    egyptAudio.addEventListener('error', () => {
        if (statusText) statusText.textContent = 'خطأ في تحميل البث';
        if (playerPanel) playerPanel.classList.remove('playing');
        if (counterLabel) counterLabel.textContent = 'خطأ';
        if (liveIndicator) liveIndicator.classList.remove('active');
    });

    egyptAudio.addEventListener('play', () => {
        updateStatus('playing');
        startCounter();
        if (liveIndicator) liveIndicator.classList.add('active');
        if (counterLabel) counterLabel.textContent = 'يتم التشغيل الآن';
    });

    egyptAudio.addEventListener('pause', () => {
        updateStatus('paused');
        stopCounter();
        if (liveIndicator) liveIndicator.classList.remove('active');
        if (counterLabel) counterLabel.textContent = 'متوقف مؤقتاً';
    });

    egyptAudio.addEventListener('ended', () => {
        updateStatus('stopped');
        stopCounter();
        if (liveIndicator) liveIndicator.classList.remove('active');
        if (counterLabel) counterLabel.textContent = 'متوقف';
    });

    // Volume slider event listeners
    if (volumeSlider) {
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

        // Initialize volume
        updateVolume();
    }

    // Viewport height for mobile
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // Touch handling for buttons
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });

        button.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
    });

    // Initialize audio volume for non-iOS devices
    if (!isIOS && egyptAudio) {
        egyptAudio.volume = 0.8;
    }

    // Panel hover effects
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        panel.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Click ripple effects
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
}

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

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();

    // Only proceed if critical elements are found
    if (egyptAudio && statusText) {
        setupEventListeners();
        updateStatus('ready');
    } else {
        console.error('Critical elements not found. Retrying...');
        // Retry after a short delay (for Astro's hydration)
        setTimeout(() => {
            initializeElements();
            if (egyptAudio && statusText) {
                setupEventListeners();
                updateStatus('ready');
            }
        }, 500);
    }
});