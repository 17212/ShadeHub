class AudioSynth {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.05; // Very subtle
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

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playHover() {
        // Soft click/pop
        this.playTone(600, 'sine', 0.03);
    }

    playClick() {
        // Soft tap
        this.playTone(400, 'sine', 0.05);
    }
}

export const audioSys = new AudioSynth();
