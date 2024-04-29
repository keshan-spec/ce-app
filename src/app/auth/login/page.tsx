'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/shared/Button";
import { handleSignIn } from "@/actions/auth-actions";
import { ErrorMessage } from "@/shared/ErrorMessage";
import { useSearchParams } from "next/navigation";
import { revalidatePath } from "next/cache";

const Login = () => {
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 3000);
    }, [error]);

    const handleSubmit = async (formData: FormData) => {
        try {
            const rawFormData = {
                email: formData.get("email")?.toString(),
                password: formData.get("password")?.toString(),
                redirectTo: callbackUrl
            };

            // validation
            if (!rawFormData.email) {
                setError("Email is required");
            }

            if (!rawFormData.password) {
                setError("Password is required");
            }

            if (rawFormData.email && rawFormData.password) {
                setError("");

                const response = await handleSignIn(rawFormData);

                if (response?.error) {
                    setError(response.error);
                    return;
                }
            }
        } catch (error: any) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="relative max-h-[100vh] overflow-hidden h-screen w-full flex items-center flex-col pt-20 px-4">
            <Image src="/assets/img/logo1.png" alt="logo" width={300} height={300} />

            <form className="w-full max-w-md px-5 mt-12" action={handleSubmit}>
                <div className="mb-4">
                    <input
                        className="appearance-none rounded w-full !p-3 text-white placeholder:text-white/60 bg-theme-dark-100 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email Address"
                    />
                </div>
                <div className="">
                    <input
                        className="appearance-none rounded w-full !p-3 text-white bg-theme-dark-100 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    {error && <ErrorMessage message={error} />}
                    <Button type="submit" icon={<i className="ml-2 fas fa-chevron-right"></i>}>
                        Login
                    </Button>
                </div>
                <div className="flex flex-col w-full items-center mt-4">
                    <p className="text-xs font-medium text-white">No account?</p>
                    <p className="text-xs text-white">
                        Sign up via <a href="https://www.carevents.com" className="hover:text-theme-primary transition-all">carevents.com</a> or download the app
                    </p>
                </div>
            </form>
            <Image src="/assets/img/login-bg.jpg" alt={"Login Background"} layout="fill" objectFit="cover" className="absolute inset-0 -z-10" />
        </div>
    );
};

export default Login;