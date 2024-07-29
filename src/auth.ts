// https://authjs.dev/getting-started/deployment
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { getUserDetails } from "@/actions/auth-actions";

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
                session.user.id = token?.sub;
                const data = await getUserDetails(token.sub);

                if (data && data.user) {
                    session.user.first_name = data.user.first_name;
                    session.user.last_name = data.user.last_name;
                    session.user.username = data.user.username;
                    session.user.roles = data.user.roles;
                    session.user.profile_image = data.user.profile_image;
                    session.user.followers = data.user.followers;
                    session.user.following = data.user.following;
                    session.user.posts_count = data.user.posts_count;
                    session.user.profile_links = data.user.profile_links;
                    session.user.email = data.user.email;
                    session.user.cover_image = data.user.cover_image;
                    session.user.can_update_username = data.user.can_update_username;
                    session.user.next_update_username = data.user.next_update_username;
                    session.user.last_location = data.user.last_location;

                    if (data.user.billing_info) {
                        session.user.billing_info = data.user.billing_info;
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