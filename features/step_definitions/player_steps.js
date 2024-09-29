import { Given, When, Then } from '@cucumber/cucumber';
import { launch } from 'puppeteer';

let browser, page;

Given('the video player is initialized', { timeout: 15000 }, async function () {
  browser = await launch({ headless: true });
  page = await browser.newPage();
  await page.goto('http://localhost:8080');
  await page.waitForSelector('video');
  console.log('Video player initialized');
});

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
