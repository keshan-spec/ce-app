// https://authjs.dev/getting-started/deployment
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { getUserDetails } from "./api-functions/auth";

export type ExternalLinkType = {
    id: string;
    link: {
        label: string;
        url: string;
    };
};

export type ProfileLinks = {
    instagram: string;
    tiktok: string;
    facebook: string;
    email: string;
    youtube: string;
    custodian: string;
    mivia: string;
    external_links: ExternalLinkType[];
};

export type AuthUser = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    can_update_username?: boolean;
    next_update_username?: string;
    roles: string[];
    profile_image: string;
    cover_image: string;
    followers: string[];
    following: string[];
    posts_count: number;
    profile_links: ProfileLinks;
    email: string;
    last_location?: {
        latitude: number;
        longitude: number;
    };
    billing_info?: {
        phone?: string;
        address_1: string;
        address_2: string;
        city: string;
        country: string;
        postcode: string;
        state: string;
    };
    detailsFetched?: boolean;
};

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: AuthUser;
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    trustHost: true,
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session.user && token?.sub) {
                session.user.id = token.sub;

                // Only fetch user details if they are not already in the session
                if (!session.user.detailsFetched) {
                    try {
                        const data = await getUserDetails(token.sub);

                        if (!data || !data.user) {
                            return session;
                        }

                        const { user } = data;

                        if (user) {
                            const {
                                first_name,
                                last_name,
                                username,
                                roles,
                                profile_image,
                                followers,
                                following,
                                posts_count,
                                profile_links,
                                email,
                                cover_image,
                                can_update_username,
                                next_update_username,
                                last_location,
                                billing_info,
                            } = user;

                            Object.assign(session.user, {
                                first_name,
                                last_name,
                                username,
                                roles,
                                profile_image,
                                followers,
                                following,
                                posts_count,
                                profile_links,
                                email,
                                cover_image,
                                can_update_username,
                                next_update_username,
                                last_location,
                                billing_info,
                                detailsFetched: true, // Flag to avoid fetching again
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching user details:', error);
                    }
                }
            }

            return session;
        },
        jwt: async ({ token }) => {
            return token;
        },
    },
    session: { strategy: "jwt" },
    ...authConfig,
});