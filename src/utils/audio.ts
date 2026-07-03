class AmbientSynthesizer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  init() {
    if (this.audio) return;
    const baseUrl = import.meta.env.BASE_URL || '/';
    this.audio = new Audio(baseUrl + 'bgm.ogg');
    this.audio.loop = true;
    this.audio.volume = 0.5; // Set a relaxing volume
  }

  play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.audio) return;
    
    this.audio.play().then(() => {
      this.isPlaying = true;
    }).catch(err => {
      console.error('Audio play failed:', err);
    });
  }

  stop() {
    if (!this.isPlaying || !this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
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
