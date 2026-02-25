import { Howl, Howler } from 'howler';

class QuranRadioPlayer {
    constructor(config = {}) {
        this.config = {
            streamUrls: [
                'https://n01.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABmXK3CA0AlLPRdfTei-KzcQ',
                'https://n06.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABmXITLbUAnkhYRNoalMnuuw'
            ],
            volume: 0.8,
            ...config
        };

        this.sound = null;
        this.isPlaying = false;
        this.playbackTime = 0;
        this.counterInterval = null;

        this.elements = {};
        this.translations = this.config.translations || {};

        this.init();
    }

    init() {
        this.setupElements();
        this.createSound();
        this.attachEventListeners();
        this.updateStatus('ready');
    }

    setupElements() {
        this.elements = {
            status: document.getElementById('status'),
            statusIndicator: document.querySelector('.status-indicator'),
            playerPanel: document.querySelector('.player-panel'),
            volumeSlider: document.getElementById('volumeSlider'),
            volumeValue: document.querySelector('.volume-value'),
            volumeFill: document.querySelector('.volume-fill'),
            volumeIcon: document.querySelector('.volume-icon'),
            currentTime: document.getElementById('currentTime'),
            currentSeconds: document.getElementById('currentSeconds'),
            liveIndicator: document.querySelector('.live-indicator'),
            counterLabel: document.getElementById('counterLabel'),
            playBtn: document.querySelector('.play-btn'),
            stopBtn: document.querySelector('.stop-btn'),
            refreshBtn: document.querySelector('.refresh-btn')
        };
    }

    createSound() {
        // Create new Howl instance
        this.sound = new Howl({
            src: this.config.streamUrls,
            html5: true, // Force HTML5 Audio for streaming
            format: ['mp3'],
            volume: this.config.volume,
            preload: false,
            autoplay: false,
            onplay: () => this.onPlay(),
            onstop: () => this.onStop(),
            onpause: () => this.onPause(),
            onend: () => this.onEnd(),
            onloaderror: (id, error) => this.onError(error),
            onplayerror: (id, error) => this.onError(error)
        });
    }

    play() {
        if (!this.sound) {
            this.createSound();
        }

        this.updateStatus('loading');

        try {
            this.sound.play();
        } catch (error) {
            console.error('Play error:', error);
            this.updateStatus('error');

            // Retry after user interaction
            setTimeout(() => {
                this.updateStatus('ready');
            }, 2000);
        }
    }

    stop() {
        if (this.sound) {
            this.sound.stop();
            this.sound.unload();
            this.sound = null;
        }
        this.stopCounter();
        this.updateStatus('stopped');
    }

    refresh() {
        this.updateStatus('refreshing');
        this.animateRefreshButton();

        // Stop and recreate
        if (this.sound) {
            this.sound.unload();
        }

        this.createSound();

        setTimeout(() => {
            this.play();
        }, 500);
    }

    setVolume(value) {
        const volume = value / 100;
        if (this.sound) {
            this.sound.volume(volume);
        }
        this.updateVolumeUI(value);
    }

    updateVolumeUI(value) {
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = value + '%';
        }
        if (this.elements.volumeFill) {
            this.elements.volumeFill.style.height = value + '%';
        }
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.style.background =
                `linear-gradient(to top, var(--primary-glow) 0%, var(--primary-glow) ${value}%, rgba(255, 255, 255, 0.1) ${value}%, rgba(255, 255, 255, 0.1) 100%)`;
        }
        if (this.elements.volumeIcon) {
            this.elements.volumeIcon.textContent =
                value == 0 ? '🔇' :
                value < 33 ? '🔈' :
                value < 66 ? '🔉' : '🔊';
        }
    }

    updateStatus(status) {
        const statusTexts = {
            ready: this.translations.ready || 'Ready',
            loading: this.translations.loading || 'Loading...',
            playing: this.translations.playing || 'Playing',
            stopped: this.translations.stopped || 'Stopped',
            paused: this.translations.paused || 'Paused',
            refreshing: this.translations.refreshing || 'Refreshing...',
            error: this.translations.error || 'Error'
        };

        if (this.elements.status) {
            this.elements.status.textContent = statusTexts[status] || statusTexts.ready;
        }

        if (this.elements.counterLabel) {
            this.elements.counterLabel.textContent = statusTexts[status] || statusTexts.ready;
        }

        if (this.elements.statusIndicator) {
            if (status === 'playing') {
                this.elements.statusIndicator.classList.add('playing');
            } else {
                this.elements.statusIndicator.classList.remove('playing');
            }
        }

        if (this.elements.playerPanel) {
            if (status === 'playing') {
                this.elements.playerPanel.classList.add('playing');
            } else {
                this.elements.playerPanel.classList.remove('playing');
            }
        }
    }

    startCounter() {
        this.playbackTime = 0;
        clearInterval(this.counterInterval);
        this.counterInterval = setInterval(() => {
            this.playbackTime++;
            this.updateCounter();
        }, 1000);
    }

    stopCounter() {
        clearInterval(this.counterInterval);
        this.playbackTime = 0;
        this.updateCounter();
    }

    updateCounter() {
        if (this.elements.currentTime && this.elements.currentSeconds) {
            const mins = Math.floor(this.playbackTime / 60);
            const secs = this.playbackTime % 60;
            this.elements.currentTime.textContent = mins.toString().padStart(2, '0');
            this.elements.currentSeconds.textContent = secs.toString().padStart(2, '0');
        }
    }

    animateButton(button) {
        if (!button) return;

        const ripple = button.querySelector('.btn-ripple');
        if (ripple) {
            ripple.style.display = 'block';
            ripple.style.animation = 'ripple-effect 0.6s ease-out';
            setTimeout(() => {
                ripple.style.display = 'none';
                ripple.style.animation = '';
            }, 600);
        }
    }

    animateRefreshButton() {
        if (this.elements.refreshBtn) {
            const svg = this.elements.refreshBtn.querySelector('.btn-svg');
            if (svg) {
                svg.style.animation = 'rotate-icon 1s ease-in-out';
                setTimeout(() => {
                    svg.style.animation = '';
                }, 1000);
            }
            this.animateButton(this.elements.refreshBtn);
        }
    }

    // Event callbacks
    onPlay() {
        this.isPlaying = true;
        this.updateStatus('playing');
        this.startCounter();

        if (this.elements.liveIndicator) {
            this.elements.liveIndicator.classList.add('active');
        }
        if (this.elements.playBtn) {
            this.elements.playBtn.classList.add('playing');
            this.animateButton(this.elements.playBtn);
        }
    }

    onStop() {
        this.isPlaying = false;
        this.updateStatus('stopped');
        this.stopCounter();

        if (this.elements.liveIndicator) {
            this.elements.liveIndicator.classList.remove('active');
        }
        if (this.elements.playBtn) {
            this.elements.playBtn.classList.remove('playing');
        }
        this.animateButton(this.elements.stopBtn);
    }

    onPause() {
        this.isPlaying = false;
        this.updateStatus('paused');
        this.stopCounter();

        if (this.elements.liveIndicator) {
            this.elements.liveIndicator.classList.remove('active');
        }
    }

    onEnd() {
        this.onStop();
    }

    onError(error) {
        console.error('Audio error:', error);
        this.updateStatus('error');
        this.stopCounter();

        if (this.elements.liveIndicator) {
            this.elements.liveIndicator.classList.remove('active');
        }
    }

    attachEventListeners() {
        // Volume control
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
            });

            // Initialize volume
            this.setVolume(this.elements.volumeSlider.value);
        }

        // Mobile viewport height fix
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
    }
}

// Export for use
window.QuranRadioPlayer = QuranRadioPlayer;