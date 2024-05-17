// https://authjs.dev/getting-started/deployment
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { getUserDetails } from "@/actions/auth-actions";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            first_name: string;
            last_name: string;
            username: string;
            roles: string[];
            profile_image: string;
        } & DefaultSession["user"];
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

                if (data) {
                    session.user.first_name = data.user.first_name;
                    session.user.last_name = data.user.last_name;
                    session.user.username = data.user.username;
                    session.user.roles = data.user.roles;
                    session.user.profile_image = data.user.profile_image;
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