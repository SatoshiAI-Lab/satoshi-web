export const useEnv = () => {
  return {
    isDevMode: process.env.NODE_ENV === 'development',
    isProdMode: process.env.NODE_ENV === 'production',
  }
}
