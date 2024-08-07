"use server";

import { AuthUser, signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

const API_URL = process.env.HEADLESS_CMS_API_URL ?? "https://www.carevents.com";

import { auth } from "@/auth";
import { NewUser } from "@/app/context/SignUpProvider";
import { UserDetailsForm } from "@/zod-schemas/profile";

interface SignUpResponse {
    success: boolean;
    message: string;
    code?: 'email_exists' | 'password_invalid' | 'username_exists' | 'uncaught_exception' | 'registration_failed';
    username?: string;
    user_id?: number;
}

export type UserResponse = {
    success: boolean;
    error?: string;
    user?: AuthUser;
};

export const getSessionUser = async () => {
    const session = await auth();

    if (!session) {
        return null;
    }

    return session.user;
};

export const verifyUser = async (credentials: { email: string; password: string; }) => {
    try {
        const response = await fetch(`${API_URL}/wp-json/ticket_scanner/v1/verify_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const handleSignOut = async () => {
    await signOut({
        redirect: true,
        redirectTo: "/auth/login",
    });
};

export const handleSignIn = async (credentials: {
    email: string | undefined;
    password: string | undefined;
    redirectTo?: string | null | undefined;
}) => {
    try {
        await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            redirectTo: credentials.redirectTo || DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
};

export const handleSignUp = async (user: NewUser): Promise<SignUpResponse | null> => {
    try {
        const response = await fetch(`${API_URL}/wp-json/app/v1/register-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.status !== 201) {
            return {
                success: false,
                message: data.message,
                code: data.code,
            };
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateUsername = async (user: { user_id: number | string; username: string; }) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/update-username`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
};

export const updatePassword = async (new_password: string, old_password: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, new_password, old_password }),
    });

    const data = await response.json();
    return data;
};

export const updateUserDetails = async (details: UserDetailsForm, email_changed: boolean) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-user-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, ...details, email_changed }),
    });

    const data = await response.json();
    return data;
};