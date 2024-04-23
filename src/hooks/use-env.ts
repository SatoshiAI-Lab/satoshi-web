/**
 * Management `.env*` file.
 */
export const useEnv = () => {
  return {
    // env mode.
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  }
}
