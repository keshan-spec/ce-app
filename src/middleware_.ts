import { NextResponse } from "next/server";
import { getIDFromQrCode } from "./actions/qr-actions";
import { auth } from "./auth";

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    apiRoutes,
    authRoutes,
} from "@/routes";

// @ts-ignore
export async function middleware(req) {
    const { nextUrl } = req;

    // const isLoggedIn = !!req.auth;
    const isLoggedIn = !!req.cookies.get('auth');
    const pathname = nextUrl.pathname;

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
    const isApiWebhookRoute = apiRoutes.includes(pathname);

    if (isApiAuthRoute || isApiWebhookRoute) {
        return NextResponse.next();
    }

    const isAuthRoute = authRoutes.includes(pathname);
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return NextResponse.next();;
    }

    if (!isLoggedIn /*&& !isPublicRoute && !publicDynamicRoute*/) {
        let callbackUrl = pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return NextResponse.redirect(new URL(
            `/auth?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (pathname === '/qr' || pathname.startsWith('/qr/')) {
        // Get `id` from URL path or query parameter
        const [, , idFromPath] = pathname.split('/');

        if (idFromPath) {
            try {
                const data = await getIDFromQrCode(idFromPath);
                const id = data?.data?.linked_to;
                return NextResponse.redirect(new URL(`/profile/${id}`, nextUrl));
            } catch (e) {
                console.error('Error getting ID from QR code', e);
                const redirectUrl = new URL('/', nextUrl);
                redirectUrl.searchParams.set('error', 'invalid-qr');
                return NextResponse.redirect(redirectUrl);
            }
        }
    }

    return NextResponse.next();
}

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: [
        '/((?!.*\\..*|_next|api/auth/session).*)',
        '/',
        '/(api|trpc)(.*)'
    ],
};
