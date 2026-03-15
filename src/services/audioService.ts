class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  playHover() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playClick() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSwoosh() {
    if (!this.ctx || !this.masterGain) return;
    const duration = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < duration; i++) data[i] = Math.random() * 2 - 1;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2000, this.ctx.currentTime + 0.2);
    filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  playSuccess() {
    if (!this.ctx || !this.masterGain) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const now = this.ctx!.currentTime;
      const offset = i * 0.05;
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.8);
      osc.start(now + offset);
      osc.stop(now + offset + 0.8);
    });
  }
}

export const audioService = new AudioService();
