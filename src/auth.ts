// https://authjs.dev/getting-started/deployment
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { getUserDetails } from "@/actions/auth-actions";

export type ProfileLinks = {
    instagram: string;
    tiktok: string;
    facebook: string;
    email: string;
    links: {
        label: string;
        url: string;
    }[];
};

export type AuthUser = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    roles: string[];
    profile_image: string;
    followers: string[];
    following: string[];
    posts_count: number;
    profile_links: ProfileLinks;
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