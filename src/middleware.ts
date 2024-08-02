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
export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    const isApiWebhookRoute = apiRoutes.includes(nextUrl.pathname);
    if (isApiWebhookRoute) {
        return NextResponse.next();
    }

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return NextResponse.next();
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/auth', nextUrl));
    }

    if (req.nextUrl.pathname === '/qr' || req.nextUrl.pathname.startsWith('/qr/')) {
        // Get `id` from URL path or query parameter
        const [, , idFromPath] = req.nextUrl.pathname.split('/');

        if (idFromPath) {
            return getIDFromQrCode(idFromPath).then((data) => {
                const id = data?.data?.linked_to;
                return NextResponse.redirect(new URL(`/profile/${id}`, nextUrl));
            }).catch((e) => {
                console.error('Error getting ID from QR code', e);
                const redirectUrl = new URL('/', nextUrl);
                redirectUrl.searchParams.set('error', 'invalid-qr');
                return NextResponse.redirect(redirectUrl);
            });
        }
    }

    return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
export const config = {
    matcher: [
        '/((?!.*\\..*|_next|api/auth/session).*)',
        '/',
        '/(api|trpc)(.*)'
    ],
};