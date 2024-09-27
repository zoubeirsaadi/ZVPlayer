import shaka from 'shaka-player/dist/shaka-player.ui.js';

class VPlayer {
  constructor() {
    this.player = null;
    this.videoElement = null;
  }

  initPlayer(videoElement, manifestUri) {
    this.videoElement = videoElement;
    this.player = new shaka.Player(videoElement);

    this.player
      .load(manifestUri)
      .then(() => {
        console.log('Video successfully loaded');
      })
      .catch(this.onError);
  }

  play() {
    this.videoElement?.play();
  }

  pause() {
    this.videoElement?.pause();
  }

  onError(error) {
    console.error('Error code', error.code, 'object', error);
  }
}

export default VPlayer;
