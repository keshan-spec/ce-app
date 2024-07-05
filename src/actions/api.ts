export const API_URL = process.env.HEADLESS_CMS_API_URL ?? "https://www.carevents.com";
export const STORE_API_URL = process.env.STORE_API_URL ?? "https://www.mydrivelife.com";

const LIVE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://phpstack-889362-4370795.cloudwaysapps.com";

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : LIVE_URL;