import { verifyUser } from "@/actions/auth-actions";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { revalidatePath } from "next/cache";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials) {
                    // @ts-ignore
                    const response = await verifyUser(credentials);

                    if (response && response.success) {
                        return response.user;
                    }
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;