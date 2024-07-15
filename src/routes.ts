/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/posts",
    "/profile",
    "/store",
];

export const publcDynamicRoutes = [
    "/profile/:id",
    "/posts/:id",
    "/profile/garage/:id",
    "/store/product/:id",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

export const apiRoutes = [
    "/api/stripe/get-payment-intent",
    "/api/stripe/create-payment-intent",
    "/api/stripe/cancel-payment-intent",
    "/api/stripe/create-setup-intent",
    "/api/stripe/delete-payment-method",
    "/api/webhook",
    "/api/aws/upload",
];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/profile";
export const LOGIN_PAGE = "/auth/login";
export const AUTH_LANDING_PAGE = "/auth";