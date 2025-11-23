class AudioSynth {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1; // Keep it subtle
        this.masterGain.connect(this.ctx.destination);
        this.enabled = false;
    }

    enable() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.enabled = true;
    }

    playTone(freq, type, duration) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playHover() {
        // High pitch beep
        this.playTone(800, 'sine', 0.05);
    }

    playClick() {
        // Mechanical click
        this.playTone(200, 'square', 0.05);
        setTimeout(() => this.playTone(150, 'square', 0.05), 50);
    }

    playGlitch() {
        // Random noise burst
        if (!this.enabled) return;
        const bufferSize = this.ctx.sampleRate * 0.1; // 0.1 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
    }

    playHum() {
        // Background ambience
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 50; // Low hum

        gain.gain.value = 0.01;

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        // Loop forever
    }
}

export const audioSys = new AudioSynth();
