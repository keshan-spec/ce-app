'use client';
import { useEffect, useState } from "react";
import { Button } from "@/shared/Button";
import { handleSignIn } from "@/actions/auth-actions";
import { ErrorMessage } from "@/shared/ErrorMessage";
import { useSearchParams } from "next/navigation";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import Link from "next/link";
import { Wrapper } from "../Wrapper";

import { z } from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Loader } from "@/components/Loader";

// Define a schema that accepts either an email or a username
const loginSchema = z.object({
    email: z.union([
        z.string().min(1, 'Username or email is required'),
        z.string().email('Invalid email address'),
    ]),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            const response = await handleSignIn(data);

            if (response && response.error) {
                throw new Error(response?.error || "An error occurred");
            }
        } catch (error: any) {
            setError("root", {
                type: "manual",
                message: error?.message || "An error occurred",
            });
        }
    };

    return (
        <Wrapper>
            <div id="appCapsule">
                {isSubmitting && <Loader transulcent />}
                <div className="login-form mt-1">
                    <div id="toast-16" className={clsx(
                        "toast-box toast-top",
                        { "bg-danger": errors.root },
                        { "show": errors.root }
                    )}>
                        <div className="in">
                            <div className="text">
                                {errors.root && errors.root.message}
                            </div>
                        </div>
                        <button type="button" className="btn btn-sm btn-text-light close-button"
                            onClick={() => {
                                clearErrors();
                            }}
                        >OK</button>
                    </div>

                    <div className="section mt-1">
                        <h1><img src="/assets/img/logo-icon1.png" />Get started</h1>
                        <h4>Log in below</h4>
                    </div>
                    <div className="section mt-1 mb-5">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group boxed">
                                <div className="input-wrapper text-left">
                                    <input
                                        type="text"
                                        className={clsx(
                                            "form-control",
                                            errors.email && "!border-red-600"
                                        )}
                                        {...register('email')}
                                        placeholder="Username or Email address"
                                    />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                    </i>
                                    {errors.email && <span className="text-xs text-left text-danger w-full">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div className="form-group boxed">
                                <div className="input-wrapper text-left">
                                    <input
                                        type="password"
                                        className={clsx(
                                            "form-control",
                                            errors.password && "!border-red-600"
                                        )}
                                        {...register('password')}
                                        placeholder="Password"
                                        autoComplete="off"
                                    />
                                    <i className="clear-input">
                                        <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle" />
                                    </i>
                                    {errors.password && <span className="text-xs text-left text-danger w-full">{errors.password.message}</span>}
                                </div>
                            </div>

                            <div className="form-links mt-2">
                                <div>
                                    <Link href="/auth/register">
                                        Register Now
                                    </Link>
                                </div>
                            </div>

                            <div className="form-button-group">
                                <Button type="submit">
                                    {isSubmitting ? "Logging in..." : "Log in"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default Login;