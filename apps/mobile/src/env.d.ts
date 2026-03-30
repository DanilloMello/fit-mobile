declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_API_URL?: string;
    readonly EXPO_PUBLIC_MAGIC_LINK_REDIRECT_URL?: string;
    readonly EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
