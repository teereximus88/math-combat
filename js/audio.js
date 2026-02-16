const Audio = {
  ctx: null,
  enabled: true,
  volume: 0.3,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio not supported');
      this.enabled = false;
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // Laser pew pew sound
  laser() {
    if (!this.enabled) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.15);
  },

  // Explosion sound
  explosion() {
    if (!this.enabled) return;
    this.resume();

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  },

  // Wrong answer buzz
  wrong() {
    if (!this.enabled) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  },

  // Combo sound - pitch increases with combo
  combo(level) {
    if (!this.enabled) return;
    this.resume();

    const baseFreq = 440;
    const freq = baseFreq * Math.pow(1.2, Math.min(level, 10));

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  },

  // Level complete fanfare
  levelComplete() {
    if (!this.enabled) return;
    this.resume();

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'square';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.02);
      gain.gain.setValueAtTime(this.volume * 0.3, startTime + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  },

  // Game over sad sound
  gameOver() {
    if (!this.enabled) return;
    this.resume();

    const notes = [392, 349, 330, 262]; // G4, F4, E4, C4 (descending)
    const duration = 0.3;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, startTime + 0.05);
      gain.gain.setValueAtTime(this.volume * 0.4, startTime + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  },

  // Life lost sound
  lifeLost() {
    if (!this.enabled) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.4);
  },

  // Start game sound
  start() {
    if (!this.enabled) return;
    this.resume();

    const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
    const duration = 0.1;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'square';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(this.volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  },

  // Type key sound
  keyPress() {
    if (!this.enabled) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = 600 + Math.random() * 100;

    gain.gain.setValueAtTime(this.volume * 0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.05);
  }
};
