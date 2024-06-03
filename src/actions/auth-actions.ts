"use server";

import { AuthUser, signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

const API_URL = process.env.HEADLESS_CMS_API_URL ?? "https://www.carevents.com";

import { auth } from "@/auth";
import { NewUser } from "@/app/context/SignUpProvider";

export const getSessionUser = async () => {
    const session = await auth();

    if (!session) {
        throw new Error("No session found");
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
            cache: "no-cache",
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            return JSON.parse(await response.json());
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

export type UserResponse = {
    success: boolean;
    error?: string;
    user?: AuthUser;
};

export const getUserDetails = async (id: string): Promise<UserResponse | null> => {
    let url = `${API_URL}/wp-json/app/v1/get-user-profile`;
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
    });

    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message);
    return data;
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

interface SignUpResponse {
    success: boolean;
    message: string;
    code?: 'email_exists' | 'password_invalid' | 'username_exists' | 'uncaught_exception' | 'registration_failed';
    username?: string;
    user_id?: number;
}

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

export const updateUsername = async (user: { user_id: number; username: string; }) => {
    try {
        const response = await fetch(`${API_URL}/wp-json/app/v1/update-username`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        return error;
    }
};