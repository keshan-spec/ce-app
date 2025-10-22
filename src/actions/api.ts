export const API_URL = process.env.HEADLESS_CMS_API_URL ?? "https://www.carevents.com";
export const STORE_API_URL = process.env.STORE_API_URL ?? "https://www.mydrivelife.com";

const LIVE_URL = "https://ce-app-alpha.vercel.app";

// export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : LIVE_URL;
export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : LIVE_URL;

export const FIXED_SHIPPING_COST = 3.95;
