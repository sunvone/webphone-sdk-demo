declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class AudioVisualizer {
  audio: MediaStream | null = null;
  canvas: HTMLCanvasElement | null = null;
  canvasContext: CanvasRenderingContext2D | null = null;
  analyser: AnalyserNode | null = null;
  animationFrame = 0;
  color = '#efefef';

  constructor(stream: MediaStream, canvas: HTMLCanvasElement, color?: string) {
    this.animationFrame = 0;

    this.audio = stream;

    if (color) {
      this.color = color;
    }

    this.canvas = canvas;
    if (this.canvas) {
      //this.canvas.width = 200 * 4;
      //this.canvas.height = 256;
      this.canvasContext = this.canvas.getContext('2d');
    }
  }

  init() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 512; //1024
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    if (this.audio) {
      const source = audioContext.createMediaStreamSource(this.audio);
      source.connect(this.analyser);
    }
  }

  play() {
    if (!this.analyser) {
      this.init();
    }
    this.animate();
  }

  pause() {
    cancelAnimationFrame(this.animationFrame);
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());
    this.onFrame();
  }

  onFrame() {
    if (this.analyser && this.canvasContext && this.canvas) {
      //const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const gradient = this.canvasContext.createLinearGradient(0, 0, 0, this.canvas.height || 64);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.color);

      this.analyser.getByteFrequencyData(dataArray);

      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //dataArray.length
      const barWidth = (this.canvas.width / dataArray.length) * 10;
      let barHeight = 0;
      let x = 0;
      const gap = 2;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < dataArray.length; i++) {
        this.canvasContext.fillStyle = gradient;
        //this.canvasContext.fillRect(i * 5, ((this.canvas.height || 256) - dataArray[i] / 4), 4, dataArray[i]);
        barHeight = dataArray[i] / (this.canvas.height - 20);

        this.canvasContext.beginPath();
        this.canvasContext.roundRect(x, this.canvas.height / 2, barWidth, barHeight, [0, 0, 3, 3]);

        this.canvasContext.fill();

        this.canvasContext.fillRect(x, this.canvas.height / 2, barWidth, 1);

        this.canvasContext.beginPath();
        this.canvasContext.roundRect(
          x,
          this.canvas.height / 2 - barHeight,
          barWidth,
          barHeight,
          [3, 3, 0, 0]
        );
        this.canvasContext.fill();

        x += barWidth + gap;
      }
    }
  }
}
