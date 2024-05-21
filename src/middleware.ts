import { getIDFromQrCode } from "./actions/qr-actions";
import { auth } from "./auth";

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publcDynamicRoutes,
    publicRoutes,
} from "@/routes";

// @ts-ignore
export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // check for dynamic routes
    const publicDynamicRoute = publcDynamicRoutes.find((route) => {
        const re = new RegExp(`^${route.replace(/:[^/]+/g, '([^/]+)')}$`);
        return re.test(nextUrl.pathname);
    });


    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute && !publicDynamicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (req.nextUrl.pathname === '/qr' || req.nextUrl.pathname.startsWith('/qr/')) {
        // Get `id` from URL path or query parameter
        const [, , idFromPath] = req.nextUrl.pathname.split('/');

        if (idFromPath) {
            return getIDFromQrCode(idFromPath).then((data) => {
                const id = data?.data?.linked_to;
                return Response.redirect(new URL(`/profile/${id}`, nextUrl));
            }).catch((e) => {
                console.error('Error getting ID from QR code', e);
                const redirectUrl = new URL('/', nextUrl);
                redirectUrl.searchParams.set('error', 'invalid-qr');
                return Response.redirect(redirectUrl);
            });
        }
    }


    return null;
});


// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};