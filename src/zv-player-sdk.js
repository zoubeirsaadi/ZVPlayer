import shaka from 'shaka-player/dist/shaka-player.ui.js';

class ZVPlayer {
  constructor() {
    this.player = null;
    this.videoElement = null;
  }

  // Initializes the player and attaches it to a video element
  initPlayer(videoElement, videoUri, drmConfig = null, abrConfig = null) {
    this.videoElement = videoElement;
    this.player = new shaka.Player();

    // Configure DRM settings if provided
    if (drmConfig) {
      this.player.configure({
        drm: drmConfig,
      });
    }

    // Configure ABR (Adaptive Bitrate) if provided
    if (abrConfig) {
      this.player.configure({
        abr: {
          enabled: abrConfig.enabled ?? true, // Enable ABR by default
          defaultBandwidthEstimate:
            abrConfig.defaultBandwidthEstimate ?? 5000000, // Default estimate if not provided
          restrictions: {
            minBandwidth: abrConfig.minBandwidth ?? 1000000, // Minimum bitrate in bps
            maxBandwidth: abrConfig.maxBandwidth ?? 8000000, // Maximum bitrate in bps
          },
          switchInterval: abrConfig.switchInterval ?? 2, // Default 2 seconds between quality switches
        },
      });
    }

    // Attach the video element to the player
    this.player
      .attach(videoElement)
      .then(() => {
        // Load the manifest (DASH or HLS)
        return this.player.load(videoUri);
      })
      .catch(this.onError);
  }

  // Play the video
  play() {
    this.videoElement?.play();
  }

  // Pause the video
  pause() {
    this.videoElement?.pause();
  }

  // Handle player errors
  onError(error) {
    console.error('Error:', error);
  }
}

export default ZVPlayer;
