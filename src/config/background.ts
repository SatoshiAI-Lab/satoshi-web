const baseURL = process.env.NEXT_PUBLIC_CDN_URL

/**
 * Management background images config.
 */
export const BACKGROUND_CONFIG = {
  // Don't use a function to generate the background image URLs,
  // because it's not easy read.
  urls: [
    // light
    `${baseURL}/backgrounds/bright-1.jpg`,
    `${baseURL}/backgrounds/bright-2.jpg`,
    `${baseURL}/backgrounds/bright-3.jpg`,
    `${baseURL}/backgrounds/bright-4.jpg`,
    `${baseURL}/backgrounds/bright-5.jpg`,
    `${baseURL}/backgrounds/bright-6.jpg`,
    `${baseURL}/backgrounds/bright-7.jpg`,
    `${baseURL}/backgrounds/bright-8.jpg`,
    `${baseURL}/backgrounds/bright-9.jpg`,
    `${baseURL}/backgrounds/bright-10.jpg`,
    `${baseURL}/backgrounds/bright-11.jpg`,
    `${baseURL}/backgrounds/bright-12.jpg`,
    `${baseURL}/backgrounds/bright-13.jpg`,

    // dark
    `${baseURL}/backgrounds/black-1.jpg`,
    `${baseURL}/backgrounds/black-2.jpg`,
    `${baseURL}/backgrounds/black-3.jpg`,
    `${baseURL}/backgrounds/black-4.jpg`,
    `${baseURL}/backgrounds/black-5.jpg`,
    `${baseURL}/backgrounds/black-6.jpg`,
    `${baseURL}/backgrounds/black-7.jpg`,
    `${baseURL}/backgrounds/black-8.jpg`,
    `${baseURL}/backgrounds/black-9.jpg`,
    `${baseURL}/backgrounds/black-10.jpg`,
    `${baseURL}/backgrounds/black-11.jpg`,
    `${baseURL}/backgrounds/black-12.jpg`,
  ],
}
