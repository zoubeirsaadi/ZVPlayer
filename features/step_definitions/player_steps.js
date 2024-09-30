import { Given, When, Then } from '@cucumber/cucumber';
import { launch } from 'puppeteer';

let browser, page;

// Scenario for standard video initialization
Given(
  'the standard video player is initialized',
  { timeout: 15000 },
  async function () {
    browser = await launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
    await page.waitForSelector('video');
    console.log('Standard Video player initialized');
  },
);

When('the user loads a video', async function () {
  await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    videoElement.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    console.log('Video loaded');
  });
});

Then(
  'the video should be ready to play',
  { timeout: 15000 },
  async function () {
    const isReady = await page.evaluate(() => {
      const videoElement = document.querySelector('video');

      return new Promise((resolve, reject) => {
        if (!videoElement) {
          console.error('No video element found');
          return reject(new Error('No video element found'));
        }

        videoElement.oncanplay = () => {
          console.log('canplay event triggered');
          resolve(true);
        };

        videoElement.onerror = (err) => {
          console.error('Video error:', err);
          reject(new Error('Video error occurred'));
        };

        if (videoElement.readyState >= 3) {
          console.log('Video is already ready to play');
          resolve(true);
        } else {
          console.log('Waiting for video to be ready...');
        }
      });
    });

    if (!isReady) {
      throw new Error('Video is not ready to play');
    }
  },
);

When('the user clicks the play button', async function () {
  await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.play();
    }
  });
});

Then('the video should start playing', async function () {
  const isPlaying = await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    return !videoElement.paused;
  });

  if (!isPlaying) {
    throw new Error('Video is not playing');
  }
});

Given('the video is playing', async function () {
  await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.play();
    }
  });
});

When('the user clicks the pause button', async function () {
  await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.pause();
    }
  });
});

Then('the video should be paused', async function () {
  const isPaused = await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    return videoElement.paused;
  });

  if (!isPaused) {
    throw new Error('Video is not paused');
  }
});

// Scenario for video with ABR initialization
Given(
  'the ABR video player is initialized',
  { timeout: 15000 },
  async function () {
    browser = await launch({ headless: true });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
    await page.waitForSelector('video');
    console.log('ABR Video player initialized');
  },
);

When('the user loads a video with ABR', async function () {
  await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    videoElement.src = 'https://www.w3schools.com/html/mov_bbb.mp4';

    // Instantiate ZVPlayer and configure ABR
    const player = new window.ZVPlayer();

    // Store the instance globally in the window object to access it later
    window.playerInstance = player;

    player.initPlayer(videoElement, videoElement.src, null);

    // Simulate ABR configuration and monitor quality changes
    player.player.configure({
      abr: {
        enabled: true,
        defaultBandwidthEstimate: 5000000,
        restrictions: {
          minBandwidth: 1000000,
          maxBandwidth: 8000000,
        },
      },
    });
  });
});

Then(
  'the video should adjust the quality based on bandwidth',
  async function () {
    const qualityChanged = await page.evaluate(() => {
      // Récupération de l'instance du lecteur depuis le contexte de la page
      const player = window.playerInstance.player; // Assurez-vous que vous accédez à l'objet Shaka Player

      if (!player) {
        throw new Error('Player instance not found');
      }

      // Obtenir les statistiques du lecteur Shaka
      const stats = player.getStats(); // Utilisation correcte de getStats
      const currentBandwidth = stats.estimatedBandwidth;
      console.log(`Current bandwidth: ${currentBandwidth}`);

      // Simuler une chute de bande passante pour déclencher un changement de qualité ABR
      player.configure({
        abr: {
          defaultBandwidthEstimate: 1000000, // Simuler la chute de bande passante
        },
      });

      // Obtenir les nouvelles statistiques après la reconfiguration
      const newStats = player.getStats();
      const newBandwidth = newStats.estimatedBandwidth;
      console.log(`New bandwidth after adjustment: ${newBandwidth}`);

      return currentBandwidth !== newBandwidth;
    });

    if (!qualityChanged) {
      throw new Error(
        'ABR did not adjust the video quality based on bandwidth',
      );
    }
  },
);
