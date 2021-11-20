declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITCH_CALLBACK_URL: string;
      TWITCH_CLIENT: string;
      TWITCH_SECRET: string;
    }
  }
}

export {}
