class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying = false;

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);
  }

  play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    
    // Resume context if suspended (browser auto-play policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    
    // Fade in
    this.masterGain.gain.setTargetAtTime(0.15, this.ctx.currentTime, 2);

    // Create a mystical drone using multiple oscillators (F minor scale vibes)
    const frequencies = [174.61, 261.63, 349.23, 523.25]; // F3, C4, F4, C5

    frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      // LFO for slow volume modulation (breathing effect)
      const lfo = this.ctx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (i * 0.02); // very slow
      
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 0.5;
      
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      
      // Filter for warm sound
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800 + (i * 200);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      lfo.start();
      
      this.oscillators.push(osc, lfo);
    });
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    this.isPlaying = false;
    
    // Fade out
    this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
    
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
    }, 1500);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }
}

export const ambientSynth = new AmbientSynthesizer();
